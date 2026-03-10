# Skynet EPR System – Full Stack Technical Assessment

This project is a simplified **Employee Performance Record (EPR) system** inspired by AIRMAN’s Skynet platform.
It allows instructors to create performance evaluations for students, view performance summaries, and generate AI-assisted remarks.

The system demonstrates **full-stack development, database design, role-based access control, and AI-assisted workflows**.

---

# Implemented Features

## Level 1 – Core EPR System

✔ Create EPR records
✔ Edit / update EPR records
✔ View EPR records for a person
✔ Rating validation (1–5 range)
✔ Evaluation period validation
✔ PostgreSQL schema using Knex migrations

Each EPR includes:

* Evaluation period
* Overall rating
* Technical skills rating
* Non-technical skills rating
* Instructor remarks
* Status (draft / submitted / archived)

---

# Level 2 Features

## Option A – Performance Summary

Each user has a **Performance Snapshot** showing:

* Average overall rating
* Average technical rating
* Average non-technical rating
* Total number of EPRs
* Last three evaluation periods trend

This helps visualize performance progression over time.

---

## Option B – Role-Based UX (Instructor vs Student)

A lightweight **role-based access system** is implemented using a mock session.

### Instructor

* Can create EPRs for students
* Can view EPRs they wrote

### Student

* Can only view their own EPRs
* Read-only access (cannot edit or create)

This demonstrates **access control without implementing full authentication**.

---

## Option C – AI Assistant Stub

A simple **AI assist feature** was implemented to generate suggested remarks.

Users can click **“Generate Suggested Remarks”** in the EPR form, which automatically fills the remarks field based on the ratings entered.

The logic uses rule-based conditions:

| Rating        | Result                      |
| ------------- | --------------------------- |
| High scores   | Positive performance remark |
| Medium scores | Improvement suggestion      |
| Low scores    | Needs improvement feedback  |

This simulates how AI could assist instructors when writing evaluations.

---

# Tech Stack

### Frontend

* React
* TypeScript
* Axios
* CSS styling

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Knex.js migrations

### Infrastructure

* Docker Compose (PostgreSQL container)

---

# Project Structure

```
skynet-epr
│
├── backend
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── db
│   └── migrations
│
├── frontend
│   ├── components
│   ├── pages
│   └── styles
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# How to Run the Project

## 1. Clone the Repository

```
git clone <repository-url>
cd skynet-epr
```

---

# Start Database Using Docker Compose

Run PostgreSQL using:

```
docker-compose up -d
```

This starts the PostgreSQL database container defined in `docker-compose.yml`.

Database configuration:

```
Host: 127.0.0.1
Port: 5432
User: skynet
Password: skynet123
Database: skynet_epr
```

---

# Backend Setup

Navigate to backend:

```
cd backend
```

Install dependencies:

```
npm install
```

or

```
pnpm install
```

---

# Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=skynet
DB_PASSWORD=skynet123
DB_NAME=skynet_epr
```

---

# Run Database Migrations

```
npx knex migrate:latest
```

(Optional)

```
npx knex seed:run
```

---

# Start Backend

```
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend:

```
cd frontend
```

Install dependencies:

```
npm install
```

or

```
pnpm install
```

---

# Start Frontend

```
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# Testing Role-Based Behavior

Role simulation is implemented using a mock session file.

Location:

```
frontend/src/mockSession.ts
```

Example:

```
export const currentUser = {
  id: "USER_UUID",
  role: "instructor"
}
```

Change role to:

```
role: "student"
```

to test student mode.

---

# How I Used AI in This Project

AI tools were used during development to assist with:

* Documentation writing
* Debugging integration issues
* Code suggestions and improvements
* Styling suggestions for UI and CSS
* Designing rule-based logic for the AI remark generator

The project itself also includes a **simple AI assistant stub** that simulates AI-generated remarks.

---

# Future Improvements

* Add authentication using JWT
* Integrate real AI/LLM-based remark generation
* Add dashboards and charts for performance analytics
* Add pagination and filtering for EPR records

---

# Author

Kaviyadharshini M
