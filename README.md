# GeSo 

Your digital, smart guide through the health and social care system in Austria.

## Tech Stack
* SvelteKit
* TailwindCSS
* Skeleton (UI Toolkit)
* Docker Compose
* Bun
* Directus (Headless CMS)
* Postgres

## Setup
* Install Docker Compose
* Install [bun](https://bun.sh/)
* `bun install` in app/ to install dependencies
* Rename `.env.example` to `.env` and fill in your values

## Run

`docker compose up`: Run directus  
`bun run dev` in app: Run sveltekit
Directus: http://localhost:8055  
Frontend: http://localhost:5173

## Backup/Restore Directus
Run the `cms-util.sh` script and follow instructions


## Dev Documentation
### Directus CMS
* There needs to be one page with home as slug. This page is used as the landing page.

### Dynamically rendering content from flexible editor
This extension is used to provide an editor that allows to mix and match rich text and custom blocks: https://github.com/formfcw/directus-extension-flexible-editor

`contentTransformationService.ts` is used to transform the json response to html and svelte components.

#### Steps to add a new block
1. Follow the steps in the extension readme to add a new block in Directus
2. Add access rights for the new block in Directus
2. Add a new type in `src/lib/types/blocks/`
3. Extend the fields when fetching the directus data in `pageService.ts`
4. Add a new block component in `src/lib/components/blocks/`
6. Add the directus collection name and component to the map in `+page.svelte`




