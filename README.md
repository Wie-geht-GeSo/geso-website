# ![GeSo Logo](/app/static/favicon.png) GeSo

Your digital and smart navigator for the health and social care system in Austria.

## 🔧 Tech Stack

Here's what powers GeSo:

- **SvelteKit**: A framework for building highly interactive web applications.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **Skeleton (UI Toolkit)**: A simple, responsive boilerplate to kickstart any project.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **Bun**: A fast all-in-one JavaScript runtime.
- **Directus (Headless CMS)**: An open-source headless CMS for managing content and making it accessible through a RESTful API.
- **Postgres**: A powerful, open-source object-relational database system.
- **Weaviate (Vector Database)**: A cloud-native, real-time vector search engine.
- **Cohere (Semantic Search Reranking)**: AI-powered tools for improving search functionality.

## 🛠️ Setup Instructions

To get GeSo up and running, follow these steps:

1. **Install Docker Compose** to manage application services.
2. **Install Bun**: Visit [Bun's official site](https://bun.sh/) for installation instructions.
3. **Install Dependencies**: Navigate to the app directory (`cd app/`) and run `bun install` to install all necessary dependencies.
4. **Environment Variables**: Copy `.env.example` to `.env` in each service directory. Be sure to fill in the required values.
5. **Initialize Directus schema**: Run `docker compose exec directus npx directus schema apply /directus/snapshots/snapshot.yaml` to apply the Directus schema.

## 🏃 Running the Project

- **Start Services**: Use `docker compose up` to initiate and run all services.
- **Run SvelteKit**: In the `app` directory, execute `bun run dev` to start the SvelteKit application.
- **Access Directus CMS**: Open http://localhost:8055 in your browser.
- **View the Frontend**: Visit http://localhost:5173 to see the live application.

### 🔍 Setting Up Search

To vectorize and prepare pages for search with Weaviate:
1. Navigate to the `search` directory.
2. Create a Python virtual environment: `python3 -m venv .venv`.
3. Activate the virtual environment and install Python dependencies: `source .venv/bin/activate` followed by `pip install -r requirements.txt`.
4. Execute `python3 upsert-data.py` to run the script that inserts or updates data in Weaviate.


## 📚 Developer Documentation

### Directus CMS

Ensure there is at least one page with the slug `home`. This serves as the landing page for the application.

#### Backup and Restore Directus Content

Utilize the `cms-util.sh` script for backing up or restoring the whole Directus content. Simply run the script and follow the on-screen instructions.
**Note**: Use only for development. Apply proper migrations in production: https://docs.directus.io/self-hosted/cli.html

### Dynamically Rendering Content

GeSo uses an extension to allow a flexible mix of rich text and custom blocks within the Directus editor. Find it here: [Directus Extension - Flexible Editor](https://github.com/formfcw/directus-extension-flexible-editor).

To transform the JSON response into HTML and Svelte components, use the `contentTransformationService.ts`.

#### Adding a New Block

1. Refer to the extension's README for guidance on adding a new block type in Directus.
2. Create a new editor block in Directus, ensuring it has a Many-to-One (M2O) relation with the new block collection. This wrapper block is a necessary workaround for integrating existing blocks directly within the editor.
3. Set appropriate access permissions for the new block type in Directus.
4. Define a new type in `src/lib/types/blocks/` corresponding to your block.
5. Update `pageService.ts` to fetch the new block data from Directus.
6. Implement a new Svelte component for the block in `src/lib/components/blocks/`.
7. Update the `+page.svelte` component map to include the new Directus collection name and the corresponding Svelte component.
