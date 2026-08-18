# Abhiragh A R — Portfolio

Personal portfolio website showcasing cloud infrastructure engineering, projects, 35mm film photography, and sketchbook drafts.

## Tech Stack

* **Framework**: [Astro](https://astro.build/) v7 (Island Architecture / Static Site Generation)
* **UI**: [React](https://react.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **CMS**: [Notion API](https://developers.notion.com/) (`@notionhq/client`)

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhi-ragh/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file with your Notion credentials:
   ```env
   NOTION_TOKEN=your_notion_integration_token
   NOTION_DATABASE_ID=your_archive_database_id
   NOTION_PROJECTS_ID=your_projects_database_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## License

This project is licensed under the MIT License.
