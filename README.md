### Real-Time Polling Application API
This project is a real-time polling backend service that allows users to create polls, vote on poll options, and see live-updating results via WebSockets. The backend provides a RESTful API for core operations and a WebSocket layer for real-time updates.

## Technologies Used

1. Backend Framework: Node.js with Express.js

2. Database: PostgreSQL

3. ORM: Prisma

4. Real-Time Communication: Socket.IO

5. Frontend Framework: Vite and React
## REST API Endpoints
1. Users

- POST /auth/register → Register new user

- POST /auth/login → Log in

2. Polls

- POST /polls → Create a poll

- GET /polls → Retrieve all polls

- GET /polls/:id → Retrieve a specific poll

3. Votes

- POST /polls/:id/vote → Vote for a poll option

## Setup Instructions
1. Clone the repository
```
git clone https://github.com/s434/Polls-App.git
cd Polls-App
```

2. Open the backend folder
```cd backend```

3. Install dependencies
```npm install```

4. Setup environment variables

Create a .env file in the root:

```
DATABASE_URL="postgresql://user:password@localhost:5432/pollsdb"
PORT=4000
```

5. Setup database with Prisma
```
npx prisma migrate dev --name init
npx prisma generate
```

6. Run the server
```npm run dev```

7. Open the frontend folder
```cd frontend```

8. Install dependencies
```
npm install
npm install axios socket.io-client
```

9. Run Frontend
```npm run dev```

## Testing the API

- Use Postman or cURL to test endpoints.

Example:

```
curl -X POST http://localhost:4000/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Jane","email":"Jane@mail.com","password":"pass123"}'
```
