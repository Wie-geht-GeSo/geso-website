SHELL := /bin/bash

.PHONY: clean-env local-env prod-env rebuild-frontend init-search run-local run-prod stop

all: run-local

clean-env:
	rm -f app/.env && rm -f search/.env && rm -f .env

local-env: clean-env
	echo "DIRECTUS_URL=http://localhost:8055" > app/.env && echo "WEAVIATE_SCHEME=http" >> app/.env && echo "WEAVIATE_HOST=localhost:8080">> app/.env
	echo "WEAVIATE_URL=http://localhost:8080" > search/.env && echo "DIRECTUS_URL=http://localhost:8055" >> search/.env
	echo "COHERE_API_KEY=your-api-key" > .env

prod-env: 
	echo "DIRECTUS_URL=$(DIRECTUS_URL)" > app/.env && echo "WEAVIATE_SCHEME=http" >> app/.env && echo "WEAVIATE_HOST=weaviate:8080">> app/.env
	echo "COHERE_API_KEY=$(COHERE_API_KEY)" > .env

rebuild-frontend:
	docker compose -f prod-docker-compose.yml build frontend --no-cache

init-search:
	cd search && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt &&  python3 upsert-data.py && cd ..

run-local:
	docker compose -f local-docker-compose.yml up -d
	cd app && bun install && bun run dev

run-prod: rebuild-frontend
	docker compose -f prod-docker-compose.yml up -d

create-backup:
	docker compose -f local-docker-compose.yml exec directus npx directus schema snapshot --yes /directus/snapshots/snapshot.yaml
	docker compose -f local-docker-compose.yml exec database pg_dump -a --inserts -U $(DB_USER) -F t directus > cms/db_dumps/directus_$(shell date +%Y%m%d%H%M).tar

restore-backup:
	docker compose -f local-docker-compose.yml exec directus npx directus schema apply /directus/snapshots/snapshot.yaml
	docker compose -f local-docker-compose.yml exec -T database pg_restore --disable-triggers -U $(DB_USER) -d directus -F t < cms/db_dumps/directus_202405051803.tar

stop:
	docker stop geso_front || true
	docker compose -f local-docker-compose.yml down
	docker compose -f prod-docker-compose.yml down
