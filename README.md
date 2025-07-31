# CodeJudge

CodeJudge is an AI-powered, real-time online coding judge platform for competitive programming and smart learning. It enables secure code execution, intelligent suggestions, live status tracking, and seamless role-based user management.

## Live Demo

- Live App: [https://code-judge-phi.vercel.app/](https://code-judge-phi.vercel.app/)
- Demo Video: [Watch on Loom](https://www.loom.com/share/5c9fa35826f14f78930266a13668e8cf)

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Deployed on: Vercel

### Backend
- Node.js, Express.js
- MongoDB (Database)
- Redis + Bull (Job Queue)
- Google OAuth 2.0 (Authentication)
- Deployed on: Render

### Compiler Service
- Docker-based isolated code execution
- Hosted on: AWS EC2

### Storage
- AWS S3 (for problems, test cases, user files)

---

## Features

### Authentication
- Google OAuth login for secure and seamless access
- Role-based access control (User, Problem Setter, Admin)

### Admin Dashboard
- Promote users to Admin or Problem Setter
- View and manage all users and problems

### Problem Setter Dashboard
- Add, edit, and delete coding problems
- Upload input/output test files

### Code Execution
- Executes code securely in Docker containers with time/memory limits
- Jobs managed via Redis queue using Bull

### Live Submissions
- Real-time status tracking of submissions (Pending, Running, Completed, Failed)
- WebSocket-powered UI for live updates

### CodeGenie Tab
- AI-assisted problem explanation and solution guidance
- Offers hints, approaches, edge cases, and optional correct code

---
