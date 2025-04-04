# Backend Fastify Prisma Application

## Overview

This project is a backend application built with [Fastify](https://www.fastify.io/) and [Prisma](https://www.prisma.io/), using PostgreSQL as the database. It provides a RESTful API for managing dishes, restaurants, and users, complete with authentication, pagination, and error handling. The application is containerized using Docker, ensuring a consistent and easy-to-deploy environment.
A live example of this application is available at:

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
  - [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Starting the Application](#starting-the-application)
  - [Initializing the Database](#initializing-the-database)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or higher)
- [Node.js](https://nodejs.org/en/) (version 18.x), if you plan to run scripts locally
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Project Structure

```bash
.
├── app
│   ├── app.ts                 # Entry point of the application
│   ├── docker/
│   │   └── Dockerfile         # Dockerfile for the API service
│   ├── env/                   # Environment variables directory
│   ├── src/                   # Source code
│   │   ├── config/            # Configuration files
│   │   ├── entities/          # Entity definitions
│   │   ├── enums/             # Enum definitions
│   │   ├── libs/              # Library and utility functions
│   │   ├── middlewares/       # Middleware functions
│   │   ├── repositories/      # Data access layers
│   │   ├── routes/            # API route handlers
│   └──  └── services/          # Business logic services
├── docker-compose.yml         # Docker Compose configuration
├── package.json               # npm dependencies and scripts
├── prisma/
│   ├── migrations/            # Database migrations
│   ├── schema.prisma          # Prisma schema definition
│   └── seed.ts                # Database seeding script
└── usefull-scripts/           # Utility scripts
    ├── start-docker.sh        # Starts Docker containers
    ├── stop-docker.sh         # Stops Docker containers
    ├── init-docker.sh         # Initializes the database
    ├── generate-local.sh      # Generates Prisma client locally
    └── migrate-local.sh       # Runs migrations locally
```

## Environment Setup

### Environment Variables

Create an `.env` file inside the `app/env/` directory. there is a working example:

```env
# Database Configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=delivery_db

# Network Configuration
API_PORT=3000
POSTGRES_PORT=5432
API_IP=172.20.0.3
POSTGRES_IP=172.20.0.2
PRISMA_IP=172.20.0.4
SUBNET=172.20.0.0/16

# Prisma Configuration
DOCKER_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# JWT Configuration
JWT_SECRET=56d12178bd3d09cd5fe65cd0e78f6cb2a6b5a5cc4e5ed1bc77122a533d2b9174

# API Base URL
API_BASE_URL=http://localhost:3000
```

**Note:** Replace these placeholders with actual values if necessary.

## Getting Started

### Starting the Application

To start the application, run:

```bash
./usefull-scripts/start-docker.sh
```

This script will:

- Navigate to the project's root directory.
- Start the Docker containers in detached mode using `docker-compose.yml`.

### Initializing the Database

After starting the containers, initialize the database:

```bash
./usefull-scripts/init-docker.sh
```

This script will:

- Generate the Prisma client.
- Deploy the database migrations.
- Seed the database with initial data.

**Note:** Ensure that the database container is fully up and running before executing this script.

## Scripts

The `usefull-scripts/` directory contains helpful scripts:

- `start-docker.sh`: Starts the Docker containers.
- `stop_docker.sh`: Stops and removes the Docker containers.
- `init-docker.sh`: Initializes the database by running migrations and seeding data.
- `generate-local.sh`: Generates the Prisma client locally (useful for development).
- `migrate-local.sh`: Runs Prisma migrations locally.

## API Documentation

Once the application is running, API documentation is available via Swagger at:

```
http://localhost:3000/documentation
```

This provides detailed information on all available endpoints, request parameters, and response formats.

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/your-username/your-fork.git
   ```

3. **Create a branch** for your feature or fix:

   ```bash
   git checkout -b feature/your-feature
   ```

4. **Commit your changes**:

   ```bash
   git commit -m "Description of your changes"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature
   ```

6. **Create a Pull Request** on the original repository.

Please ensure your code follows the existing style guidelines and includes appropriate tests.
