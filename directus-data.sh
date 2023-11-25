#!/bin/bash
# This script is used to backup and restore the Directus data directory.

operation="$1"
backup_name="$2"
backup_dir="data/"
backup_path="backups/directus_backup_${backup_name}.zip"

# Create the backups directory if it doesn't exist
mkdir -p backups

function list_available_backups {
    echo "Available Backups:"
    echo "-----------------------------------"
    ls backups/directus_backup_*.zip | sed 's/backups\/directus_backup_//; s/.zip//' | nl
    echo "-----------------------------------"
}

function check_backup_exists {
    if [ ! -f "$backup_path" ]; then
        echo "Backup '$backup_name' not found."
        list_available_backups
        exit 1
    fi
}


case "$operation" in
backup)
    if [ -z "$backup_name" ]; then
        echo "Usage: $0 backup <name>"
        exit 1
    fi

    # Check if the backup file already exists
    if [ -f "$backup_path" ]; then
        read -p "Backup '$backup_name' already exists. Overwrite? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Backup canceled."
            exit 1
        fi
    fi

    # Create a backup
    sudo zip -r "$backup_path" "$backup_dir"
    echo "Backup created for $backup_dir with name $backup_name"
    ;;

restore)
    if [ -z "$backup_name" ]; then
        echo "Usage: $0 restore <name>"
        list_available_backups
        exit 1
    fi

    check_backup_exists

    # Unzip the backup
    sudo unzip "$backup_path" -d .
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
    sudo rm "$backup_path"
    echo "Backup '$backup_name' removed."
    list_available_backups
    ;;
*)
    echo "Invalid operation. Available operations: backup, restore, list, rm."
    echo "Usage: $0 <operation> <backup_name>"
    exit 1
    ;;
esac
