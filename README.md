#  EventZen - Microservices Event Management System

EventZen is a full-stack microservices-based event management system that allows users to create events, book events, manage attendees, and track budgets.



## Architecture

This project follows a **Microservices Architecture** with an API Gateway.

### Services Included:

* **API Gateway (Node.js)** → Routes all requests
* **Auth Service (Node.js + PostgreSQL)** → User authentication & JWT
* **Booking Service (Node.js + PostgreSQL)** → Event bookings
* **Attendee Service (Node.js + PostgreSQL)** → Manage attendees
* **Budget Service (.NET + PostgreSQL)** → Budget & expenses tracking
* **Event Service (Spring Boot + MySQL/PostgreSQL)** → Event CRUD
* **Frontend (React.js)** → UI



## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Microservices:** Spring Boot, .NET Core
* **Database:** PostgreSQL
* **API Gateway:** Express + http-proxy-middleware
* **Authentication:** JWT
* **ORM:** JPA (Spring), Dapper (.NET), pg (Node)



## API Gateway

All frontend requests go through:

```
http://localhost:4000
```

Gateway routes requests to respective services 


### API Endpoints

### Auth Service

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
GET    /api/auth/user/:id
```

---

### Event Service

```
GET    /api/events
POST   /api/events      (ADMIN)
PUT    /api/events/:id  (ADMIN)
DELETE /api/events/:id  (ADMIN)
```

---

### Booking Service

```
POST   /api/book/bookings
GET    /api/book/bookings
PUT    /api/book/bookings/:id/status (ADMIN)
```

### 👥 Attendee Service

```
GET    /api/attendee/events
GET    /api/attendee/event/:eventId
PUT    /api/attendee/status/:bookingId
```



### Budget Service

```
POST   /api/budget
GET    /api/budget
GET    /api/budget/:eventId
GET    /api/budget/events
```


## 🗄️ Database

* PostgreSQL is used across services
* Default DB name: `eventdb` 

### Tables:

* users
* bookings
* expenses
* events



## Authentication

* JWT-based authentication
* Token stored in localStorage
* Automatically attached to requests 



##  How to Run

### 1️ Start PostgreSQL

Make sure PostgreSQL is running on:

```
localhost:5433
```


### 2️ Start Services

Run each service separately:

```
# API Gateway
node index.js

# Auth Service
node index.js

# Booking Service
node index.js

# Attendee Service
node index.js

# Event Service (Spring Boot)
mvn spring-boot:run

# Budget Service (.NET)
dotnet run
```

---

### 3️ Start Frontend

```
npm install
npm start
```

---

## Key Features

* Role-based access (ADMIN / USER)
* JWT authentication
* Microservices communication via API Gateway
* Event booking system
* Budget tracking system
* Attendee management

---

## Notes

* Admin key required for ADMIN registration (`mysecretkey`)
* Duplicate booking prevented via DB constraint 
* Budget uses UPSERT logic (insert/update) 


##  Author

Agnit Pradhan
