# MERN Stack List Distributor

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive application for managing agents and distributing lists evenly among them, built with the MERN stack (MongoDB, Express.js, React.js, and Node.js).

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [File Format](#file-format)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Admin Dashboard**: Secure authentication system
- **Agent Management**: CRUD operations for agents
- **List Distribution**: Automated even distribution of lists
- **File Upload**: Support for CSV, XLS, and XLSX formats
- **Responsive UI**: Works on all device sizes

## Prerequisites

- Node.js v14+
- MongoDB 4.4+
- npm 6+ or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mern-list-distributor.git
cd mern-list-distributor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
```

4. Start the server:
```bash
npm start
```

5. Open the application in your browser:
```bash
open http://localhost:3000
```

## Configuration

The application is configured to use the following environment variables:

- `MONGODB_URI`: The connection string for your MongoDB database.
- `JWT_SECRET`: The secret key used to sign and verify JWT tokens.

## Usage

### Admin Dashboard

The admin dashboard allows you to manage agents and perform various operations on them. Here's how it works:

1. Sign in with your credentials.
2. Click on the "Agents" tab to view a list of all agents.
3. Click on the "Add Agent" button to create a new agent.
4. Enter the agent's name and email address.
5. Click on the "Save" button to save the agent.
6. Click on the "Delete" button to delete the agent.

### Agent Management

The agent management allows you to manage the lists of agents. Here's how it works:

1. Sign in with your credentials.
2. Click on the "Lists" tab to view a list of all lists.
3. Click on the "Add List" button to create a new list.
4. Enter the list's name and description.
5. Click on the "Save" button to save the list.
6. Click on the "Delete" button to delete the list.

### List Distribution

The list distribution allows you to distribute lists evenly among agents. Here's how it works:

1. Sign in with your credentials.
2. Click on the "Distribute Lists" button to distribute the lists.
3. Enter the number of lists to distribute.
4. Click on the "Distribute" button to distribute the lists.
5. The lists will be distributed evenly among the agents.

### File Upload

The file upload allows you to upload CSV, XLS, or XLSX files. Here's how it works:

1. Sign in with your credentials.
2. Click on the "Upload File" button to upload a file.
3. Select the file to upload.
4. Click on the "Upload" button to upload the file.
5. The file will be uploaded and processed.

### Responsive UI

The application is designed to work on all device sizes. Here's how it works:

1. Open the application in your browser.
2. Resize the browser window to see the responsive design.

## API Endpoints

The application provides the following API endpoints:

- `/api/agents`: CRUD operations for agents.
- `/api/lists`: CRUD operations for lists.
- `/api/distribute`: Distribute lists evenly among agents.
- `/api/upload`: Upload CSV, XLS, or XLSX files.

## File Format

The application supports the following file formats:

- CSV
- XLS
- XLSX

## Deployment

The application can be deployed to a server or a cloud platform. Here's how it works:

1. Build the application:
```bash
npm run build
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.   
