#  Network Service Desk

A modern **microservices-based helpdesk platform** for managing network service tickets, technician assignments, and real-time updates.
Built with **NestJS, React (Vite), gRPC, and Socket.IO** — fully modular and ready for local development or containerized deployment.

---

##  Overview

Network Service Desk simulates an enterprise IT support system:

*  **Clients** can create and track network issue tickets.
*  **Admins/Technicians** can assign, resolve, and update tickets.
*  **Real-time notifications** via WebSocket.
*  **API Gateway** forwards selected requests via gRPC for performance.

---

##  Architecture

| Component                     | Description                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **API Gateway (NestJS)**      | Central entry point for REST & Auth, plus gRPC client proxy to the business service |
| **Business Service (NestJS)** | Core ticket logic (CRUD, assignment, WebSocket events, gRPC server)                 |
| **Frontend (React + Vite)**   | Web dashboard for clients and technicians to manage tickets                         |
| **Database (PostgreSQL)**     | Persistent storage for users & tickets                                              |
| **Redis**          
| For message/event broadcasting at scale                                             |

---

##  Tech Stack

| Layer                       | Technology                              |
| --------------------------- | --------------------------------------- |
| Backend Framework           | NestJS (TypeScript)                     |
| API Gateway                 | REST + gRPC Client                      |
| Realtime                    | Socket.IO                               |
| Inter-service Communication | gRPC                                    |
| Frontend                    | React + Vite + TypeScript               |
| Database                    | PostgreSQL                              |
| Authentication              | JWT                                     |
| Testing                     | Jest + Supertest + WebSocket + gRPC e2e |
| CI/CD                       | GitHub Actions                          |
| Containerization            | Docker & Docker Compose (optional)      |

---

##  Running Without Docker

 **Run Business Service**

```bash
cd backend/business-service
npm install
npm run start:dev
```

 **Run API Gateway**

```bash
cd backend/api-gateway
npm install
npm run start:dev
```

 **Run Frontend**

```bash
cd frontend/client-app
npm install
npm run dev
```

---

##  Access

| Service                    | URL                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| Frontend Dashboard         | [http://localhost:3002](http://localhost:3002)                   |
| API Gateway (Swagger)      | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |
| Business Service (Swagger) | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) |
| gRPC                       | localhost:50051                                                  |

---

##  Testing

* **Unit Tests**

```bash
cd backend
npm run test
```

* **E2E Tests (gRPC & WebSocket)**

```bash
cd backend/e2e
npm install
npm run grpc
npm run ws
npm run all
```
