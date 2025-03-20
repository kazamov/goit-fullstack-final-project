# Recipe Management App

A full-stack application for viewing and managing recipes. This project is built as a monorepo using Nx and pnpm.

## Project Overview

This application allows users to browse, create, edit, and manage recipes. It features a React frontend for the user interface and a Node.js backend with Express for the API, using PostgreSQL for data storage.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- Git

### Installing pnpm

This project uses pnpm as package manager. Install it by running:

```sh
npm install -g pnpm@10
```

You can verify the installation with:
```sh
pnpm --version
```

Other prerequisites:
- [Docker](https://www.docker.com/) and Docker Compose (for PostgreSQL database)

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/goit-fullstack-final-project.git
   cd goit-fullstack-final-project
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Create a `.env.serve.development.local` file in the `apps/backend` directory with required environment variables:
   ```sh
   # Example .env.serve.development.local
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=recipes_db
   DB_SCHEMA=public
   PORT=3000
   ```

4. Start the database service:
   ```sh
   pnpm services:start
   ```

5. Seed database:
   ```sh
   pnpm seed:db
   ```

## Development Workflow

### Starting Development Servers

Run the backend server:
```sh
pnpm serve:backend
```

Run the frontend development server:
```sh
pnpm serve:frontend
```

You can access:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

### Building for Production

Build all applications:
```sh
pnpm build:all
```

Run the backend in production mode:
```sh
pnpm serve:backend:production
```

## Testing

Run tests for affected projects:
```sh
pnpm test:affected
```

Run all tests:
```sh
pnpm test:all
```

## Project Structure

This project uses an Nx monorepo structure:

- `apps/frontend`: React frontend application
- `apps/backend`: Express API backend
- `libs/`: Shared libraries and components
- `tools/`: Utility scripts and configurations

## Available Scripts

- `pnpm serve:frontend`: Start the frontend development server
- `pnpm serve:backend`: Start the backend development server
- `pnpm services:start`: Start required Docker services (PostgreSQL)
- `pnpm services:stop`: Stop Docker services
- `pnpm lint:all`: Run linting on all projects
- `pnpm build:all`: Build all projects
- `pnpm test:all`: Run all tests
- `pnpm format`: Format code

## Technologies Used

- **Frontend**: React, React Router, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Sequelize ORM
- **Testing**: Vitest, Playwright
- **Tools**: Nx, ESLint, Prettier, Docker

## Deployment

This application is hosted on [Render.com](https://render.com) with the following services:
- Frontend: Static Site with automated builds
- Backend: Web Service
- Database: PostgreSQL

### Continuous Deployment

The project is configured for continuous deployment:
- Production deployment is triggered automatically when:
  - A Pull Request is merged into the master branch
  - Changes are pushed directly to the master branch
- Render.com automatically builds and deploys the updated code to production
- No manual steps required for deployment

## Troubleshooting

If you encounter any issues while working with this project, try these steps:

1. **Pull the latest changes from master**:
   ```sh
   git checkout master
   git pull origin master
   ```

2. **Reinstall dependencies**:
   ```sh
   pnpm install
   ```

3. **Reload VS Code Extensions**:
   - Press `Cmd + Shift + P` (macOS) or `Ctrl + Shift + P` (Windows/Linux)
   - Type "Restart Extension Hosts" 
   - Select the option from the dropdown menu

## Contributing

1. Create a new branch for your feature: `git checkout -b feature-name`
2. Make your changes and commit them: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature-name`
4. Submit a pull request

## Learn More About Nx

- [Nx Documentation](https://nx.dev)
- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial)
