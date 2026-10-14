# Writepad

Writepad is a personal notes application with a React frontend and an ASP.NET Core Web API backend.

## Frontend — React + Vite

The frontend provides the user interface for creating, viewing, and managing notes. It uses React components, context for state management, and Vite for development and building.

### Frontend technologies
- React
- JavaScript
- Vite
- CSS
- React Context API

## Backend — ASP.NET Core Web API

The backend provides APIs for creating and managing personal notes. It includes JWT authentication, refresh tokens, password hashing, user management, and secure CRUD operations using Entity Framework Core and SQL Server.

### Backend technologies
- ASP.NET Core Web API
- C#
- JWT authentication
- Entity Framework Core
- SQL Server

## Project structure

- `src/` — React frontend source code
- `public/` — Public frontend assets
- `package.json` — Frontend dependencies and scripts
- Backend files — ASP.NET Core API, authentication, and database logic (if maintained in this repository)

## Running the React frontend

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite will display the local URL in your terminal.

