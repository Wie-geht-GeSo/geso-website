#!/bin/bash
# This script is used to backup and restore the Directus data directory.

# Exit on error
set -e
set -o pipefail

operation="$1"
environment="$2"
backup_name="$3"
backup_dirs="cms/snapshots/ cms/uploads/"
dumps="cms/db_dumps"
backup_base_path="cms/backups/directus_backup_"

# Create the backups directory if it doesn't exist
mkdir -p cms/backups

declare -A backup_map # Declare an associative array

function list_available_backups {
    echo "Available Backups:"
    local i=1

    # List files with date, sort by date (newest last), extract and format date and name
    for file in $(ls -tr $backup_base_path*.zip); do
        local name=$(basename "$file" .zip | sed 's/directus_backup_//')
        local date_time=$(date -r "$file" +"%d. %b %H:%M")
        printf "%-35s %s\n" "$name" "$date_time"
        backup_map[$i]="$name"
        let i++
    done | nl
}


function check_backup_exists {
    local backup_path="${backup_base_path}${backup_name}.zip"
    if [ ! -f "$backup_path" ]; then
        echo "Backup '$backup_name' not found."
        list_available_backups
        exit 1
    fi
}

case "$operation" in
backup)
    if [ -z "$environment" ] || [ -z "$backup_name" ]; then
        echo "Usage: $0 backup <env-docker-compose.yaml> <name>"
        exit 1
    fi

    if [[ $backup_name =~ ^[0-9]+$ ]]; then
        echo "Backup name cannot be only numbers. Please use a different name."
        exit 1
    fi

    # Check if the backup file already exists
    backup_path="${backup_base_path}${backup_name}.zip"
    if [ -f "$backup_path" ]; then
        read -p "Backup '$backup_name' already exists. Overwrite? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Backup canceled."
            exit 1
        fi
    fi

    # Create pg dumps
    docker compose -f $environment exec -u root directus chown -R node:node /directus/database /directus/extensions /directus/uploads /directus/snapshots
	docker compose -f $environment exec directus npx directus schema snapshot --yes /directus/snapshots/snapshot.yaml
	docker compose -f $environment exec database pg_dump -a --inserts -U $DB_USER -F t -T directus_users directus > cms/db_dumps/directus_$backup_name.tar

    # Create a backup
    sudo zip -r "$backup_path" $backup_dirs $dumps/directus_$backup_name.tar
    echo "Backup created for $backup_dirs with name $backup_name"
    ;;


restore)
    if [ -z "$environment" ] || [ -z "$backup_name" ]; then
        echo "Usage: $0 restore <env-docker-compose.yaml> <name|number>"
        list_available_backups
        exit 1
    fi

    # Check if backup_name is a number and get the corresponding backup name
    if [[ $backup_name =~ ^[0-9]+$ ]]; then
        backup_name=$(list_available_backups | awk -v num="$backup_name" 'NR==num+1 {print $2}')
        if [ -z "$backup_name" ]; then
            echo "Invalid backup number."
            exit 1
        fi
    fi

    backup_path="${backup_base_path}${backup_name}.zip"
    check_backup_exists

    # Ask for confirmation before restoring
    read -p "Overwrite existing directus data with backup '$backup_name'? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Restore canceled."
        exit 1
    fi

    # Unzip the backup with automatic overwrite
    sudo unzip -o "$backup_path" -d .

	docker compose -f $environment exec directus npx directus schema apply /directus/snapshots/snapshot.yaml
	docker compose -f $environment exec -T database pg_restore --disable-triggers -U $DB_USER -d directus -F t < cms/db_dumps/directus_$backup_name.tar
    docker compose -f $environment exec -u root directus chown -R node:node /directus/database /directus/extensions /directus/uploads /directus/snapshots

    echo 
    echo "Restoration complete from $backup_name."
    ;;

list)
    list_available_backups
    ;;

rm)
    if [ -z "$backup_name" ]; then
        echo "Usage: $0 rm <name>"
        list_available_backups
        exit 1
    fi

    check_backup_exists

    # Remove the backup
    backup_path="${backup_base_path}${backup_name}.zip"
    sudo rm "$backup_path"
    echo "Backup '$backup_name' removed."
    list_available_backups
    ;;
*)
    echo "Invalid operation. Available operations: backup, restore, list, rm."
    echo "Usage: $0 <operation> <env-docker-compose.yaml> <backup_name>"
    list_available_backups
    exit 1
    ;;
esac
