# Dead Drop API

Dead Drop is a secure one-time message API built with Node.js, Express, MongoDB, Redis, and Bull.

The application allows authenticated users to create secret messages that can only be read once. After a message has been read, it is permanently removed.

## Features

- User registration
- Basic Authentication
- Password hashing using SHA1
- Authentication tokens stored in Redis with TTL
- One-time secret messages
- Background job processing using Bull
- RESTful API

---

## Technologies

- Node.js
- Express
- MongoDB
- Redis
- Bull
- UUID
- SHA1

---

## Project Structure

```
.
├── server.js
├── worker.js
├── package.json
├── README.md
│
├── routes/
│   ├── index.js
│   ├── users.js
│   ├── auth.js
│   └── drops.js
│
└── utils/
    ├── db.js
    ├── redis.js
    └── queue.js
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd dead_drop
```

Install dependencies:

```bash
npm install
```

---

## Start MongoDB

```bash
mongod
```

## Start Redis

```bash
redis-server
```

---

## Run the API

```bash
node server.js
```

The server runs on:

```
http://localhost:5000
```

---

## Run the Worker

Open another terminal and run:

```bash
node worker.js
```

---

## API Endpoints

### Register a User

**POST** `/users`

```json
{
  "email": "agent@spy.io",
  "password": "secret"
}
```

Returns:

```json
{
  "id": "...",
  "email": "agent@spy.io"
}
```

---

### Login

**GET** `/connect`

Header:

```
Authorization: Basic <base64(email:password)>
```

Returns:

```json
{
  "token": "uuid-token"
}
```

---

### Create a Secret Message

**POST** `/drops`

Header:

```
X-Token: <authentication_token>
```

Body:

```json
{
  "message": "Meet at the bridge."
}
```

Returns:

```json
{
  "readToken": "uuid",
  "readOnce": true
}
```

---

### Read a Secret Message

**GET** `/drops/:token`

First request:

```json
{
  "message": "Meet at the bridge."
}
```

Second request:

```
410 Gone
```

---

## Authentication

User authentication is handled with Basic Authentication. After a successful login, a UUID token is generated and stored in Redis with a 24-hour expiration time. This token must be included in the `X-Token` header when accessing protected endpoints.

---

## One-Time Messages

Each message is assigned a unique read token. Once a message has been retrieved successfully, it is immediately deleted from Redis and cannot be accessed again.

---

## Background Jobs

Bull is used to process background tasks asynchronously. Every newly created message is added to a Bull queue, allowing the server to respond immediately while the worker handles additional processing.

---

## Status Codes

| Endpoint | Success | Error |
|----------|---------|-------|
| POST /users | 201 | 400 |
| GET /connect | 200 | 401 |
| POST /drops | 201 | 401 |
| GET /drops/:token | 200 | 410 |

---
