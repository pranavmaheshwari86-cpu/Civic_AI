# How to Run the Project

This document outlines the steps required to get the Smart Bharat project running locally.

## Prerequisites
- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **Docker** (recommended) or standalone local instances of **MongoDB** and **Redis**.

## 1. Install Dependencies
Navigate to the root directory and install all workspace dependencies:
```bash
npm install
```

## 2. Start the Databases
The application requires MongoDB (for storing data and vectors) and Redis (for queues and caching). If you have Docker installed, you can spin them up using:
```bash
docker-compose up -d
```
*Note: This starts MongoDB on port 27017 and Redis on port 6379.*

If you do not have Docker, you must install and run MongoDB and Redis natively on your machine on their respective default ports.

## 3. Configure Environment Variables
Copy the `.env.example` file to create your local `.env` configuration:
```bash
cp .env.example .env
```
Ensure to populate the API keys inside `.env` (Gemini, Anthropic, Voyage, Cloudflare R2, Google Maps, etc.) for all features to work correctly.

## 4. Start the Application Services
Open separate terminal tabs and start each of the monorepo workspaces:

**Terminal 1 — API Backend** (Runs on port 3000)
```bash
npm run dev:api
```

**Terminal 2 — Web Frontend** (Runs on port 3001)
```bash
npm run dev:web
```

**Terminal 3 — Background Worker**
```bash
npm run dev:worker
```

## 5. Access the Platform
Once all services are running without connection errors, you can access the frontend web application at:
[http://localhost:3001](http://localhost:3001)
