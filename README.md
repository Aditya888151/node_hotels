# Restaurant Management System

Full-stack restaurant management application with staff and menu management.

## Features
- ✅ Staff Management (Add, Edit, Delete, Filter)
- ✅ Menu Management (Add, Edit, Delete with Categories)
- ✅ Dark Mode UI
- ✅ Responsive Design
- ✅ MongoDB Database
- ✅ Full CRUD Operations

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Deployment:** Vercel

## Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file with MongoDB connection
4. Run: `npm run dev`
5. Open: `http://localhost:4000`

## Environment Variables
- `MONGOSH_URL`: MongoDB connection string
- `PORT`: Server port (default: 4000)

## API Endpoints
- `GET/POST /person` - Staff management
- `GET/POST/PUT/DELETE /person/:id` - Staff operations
- `GET/POST /menu` - Menu management  
- `GET/POST/PUT/DELETE /menu/:id` - Menu operations

## Deployment
Deployed on Vercel with serverless functions.