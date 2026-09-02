# 🚀 DevPilot AI

> **Autonomous Multi-Agent Software Engineering Platform**

DevPilot AI is an intelligent software engineering workspace designed to automate and streamline the software development lifecycle using specialized AI agents.

It brings together **architecture planning, development, UI/UX design, debugging, testing, documentation, and deployment workflows** into a unified platform.

---

## 🌐 Project Links

| Resource | Link |
|---|---|
| 🚀 Live Demo | Coming Soon |
| 💻 GitHub Repository | https://github.com/harshi0958/devpilot-ai |
| 📚 Documentation | [`/docs`](./docs) |

---

## ✨ Key Features

### 🤖 Specialized AI Agents

DevPilot AI provides dedicated agents for different stages of software engineering:

- 🏗️ **Architect Agent** – Designs system architecture, modules, APIs, databases and technical plans.
- 💻 **Developer Agent** – Generates implementation guidance, code and development solutions.
- 🎨 **UI/UX Agent** – Designs user flows, interfaces, components and responsive experiences.
- 🐞 **Debugger Agent** – Helps identify and resolve software issues.
- 🧪 **Testing Agent** – Supports test creation, validation and quality assurance.
- 📚 **Documentation Agent** – Generates project documentation, README files and technical documentation.

---

## 🎯 Objectives

DevPilot AI aims to:

- Automate repetitive software engineering tasks
- Improve development productivity
- Provide AI-assisted architecture and planning
- Generate and improve application code
- Support debugging and testing
- Simplify technical documentation
- Provide a centralized AI-powered development workspace

---

## 🏗️ System Architecture

The project follows a modular architecture consisting of:

```text
                    ┌──────────────────────┐
                    │      User / Team     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   DevPilot AI UI     │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Backend / API     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌────────────┐  ┌────────────┐  ┌────────────┐
        │ AI Agents  │  │  Database  │  │ AI Services│
        └────────────┘  └────────────┘  └────────────┘
                │
                ▼
        ┌─────────────────────────────────┐
        │ Architecture → Development      │
        │ → Debugging → Testing           │
        │ → Documentation → Deployment    │
        └─────────────────────────────────┘

🧩 AI Agent Workflow

User Requirement
       │
       ▼
Architect Agent
       │
       ▼
Developer Agent
       │
       ▼
UI/UX Agent
       │
       ▼
Debugger Agent
       │
       ▼
Testing Agent
       │
       ▼
Documentation Agent
       │
       ▼
Final Software Project


🛠️ Technology Stack

Frontend
Next.js
React
TypeScript
Tailwind CSS
Modern responsive UI

Backend
Node.js
TypeScript
API-based architecture

Database
Prisma ORM
Relational database architecture

AI
Specialized AI agents
AI-assisted software engineering workflows
Agent-based task execution

Development Tools
Git
GitHub
VS Code
npm

📁 Project Structure
devpilot-ai/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── package.json
│
├── docs/
│   ├── Software Requirement Specification
│   ├── System Architecture & HLD
│   ├── Database Design & ER Diagram
│   ├── API Design & Backend Specification
│   ├── Frontend Architecture & Development Guide
│   ├── User Experience Specification
│   ├── Project Vision & Scope
│   └── Project Implementation Plan
│
├── .gitignore
├── LICENSE
└── README.md


🚀 Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
Git
A supported relational database

💻 Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will be available at:

http://localhost:3000

⚙️ Backend Setup

Open another terminal and navigate to the backend:

cd backend

Install dependencies:

npm install

Configure your environment variables:

DATABASE_URL=your_database_connection_string

Run the backend according to the project configuration.

📸 Screenshots
```
## 📸 Screenshots

### Dashboard

<img width="1890" height="1028" alt="dashboard" src="<img width="1890" height="1028" alt="dashboard" src="https://github.com/user-attachments/assets/9e1c8950-12c5-4a9d-b73a-c4e1ef41d98f" />
" />

### AI Agents

<img width="1884" height="1037" alt="AI-Agents" src="<img width="1884" height="1037" alt="AI-Agents" src="https://github.com/user-attachments/assets/7a1faac2-87d1-42c7-8bcc-cd9f3d3dee4f" />
" />

### Architect Agent

<img width="1919" height="1030" alt="agent-workspace" src="<img width="1919" height="1030" alt="agent-workspace" src="https://github.com/user-attachments/assets/125a1f79-2ee1-4ad0-8f04-5a1a2c162ac0" />
" />

### Projects

<img width="1902" height="970" alt="projects" src="<img width="1902" height="970" alt="projects" src="https://github.com/user-attachments/assets/489bd089-c387-438a-8664-d4d893f9b4c7" />
" />

### Login

<img width="1919" height="1038" alt="login" src="<img width="1919" height="1038" alt="login" src="https://github.com/user-attachments/assets/03808584-9869-4242-9585-4126ad3f6978" />
" />

### Registration

<img width="1919" height="1033" alt="register" src="<img width="1919" height="1033" alt="register" src="https://github.com/user-attachments/assets/eab19bf6-e50c-43a7-9394-c862037cd136" />
" />

Screenshots will be added to the repository as the project documentation is finalized.

📚 Documentation

Detailed project documentation is available inside the docs directory.

The documentation includes:

Software Requirement Specification (SRS)
System Architecture & High-Level Design
Database Design & ER Diagram
API Design & Backend Specification
Frontend Architecture & Development Guide
User Experience Specification
Project Vision & Scope
Project Implementation Plan
Sprint Documentation
Brand Identity & Design System

🔐 Security & Configuration

Environment-specific secrets and credentials should never be committed to GitHub.

Use environment variables for:

Database credentials
API keys
AI service credentials
Authentication secrets
Deployment configuration

🚧 Project Status

Current Status: Active Development

DevPilot AI is currently under active development. Core frontend interfaces, project management screens, AI agent interfaces and backend foundations are being developed incrementally.

🔮 Future Scope

Planned improvements include:

Multi-agent task orchestration
Real AI model integration
Automated code generation
Automated project creation
GitHub repository integration
CI/CD automation
One-click application deployment
Advanced project analytics
Team collaboration
Agent memory and context management
Automated testing pipelines

👨‍💻 Author

Harshit Jariwala

MCA Student | Full Stack Developer | AI & Blockchain Enthusiast

GitHub:
https://github.com/harshi0958

📄 License

This project is licensed under the MIT License.

See the LICENSE file for more information.
