# simple-to-do-application-1061-1072

Backend (Express + MongoDB) provides REST CRUD for Todos and Swagger docs.

How to run:
1) Copy backend/.env.example to backend/.env and set:
   - MONGODB_URL (e.g., mongodb://localhost:27017)
   - MONGODB_DB (e.g., todos_db)
2) Install dependencies:
   cd backend && npm install
3) Start dev server:
   npm run dev
4) API docs available at:
   http://localhost:3000/docs

Main endpoints:
- GET    /api/todos
- GET    /api/todos/:id
- POST   /api/todos
- PUT    /api/todos/:id
- PATCH  /api/todos/:id
- DELETE /api/todos/:id
- Health: GET /

Data model (inspired by Figma MyProfile):
- title (required), description, completed, status (pending|in_progress|completed),
  dueDate, priority (low|medium|high), tags: string[],
  followersCount, followingCount, publicationsCount.