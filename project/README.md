# Project Agent Instructions

## Project Overview
- **Name**: Finnish Language Learner
- **Description**: A web application that helps English users learn and practice their reading, writing, listening and speaking Finnish language skills.
- **Type**: Web App

---

## AI Coding Tools
- **IDE and LLMs**
  - Antigravity IDE with Gemini 3 Pro High AND Claude Opus 4.5 Thinking (switching LLMs depending on available capacity relative to rate limits)
- **MCP server**
  - Context7 documentation MCP server for LLM to retrieve the relevant documentation if it is unsure of a library's syntax

---

## Tech Stack
- **Language**: TypeScript (frontend), Python (backend)
- **Framework**: Next.js (frontend), FastAPI (backend)
- **Database**: SQLite
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- Docker: yes
- **LLMs if needed**
  - For speech to text: Google SpeechRecognition API
    - During the implementation, we discovered that the "gemini-2.5-flash-native-audio-dialog live API" is not compatible with the browser's webm audio format. To fix this by converting PCM (Pulse Code Modulation) format to webm format, it might complicate our build, which is not the intention of this prototype. This prototype is intended to be a simple implementation of the required functionalities and technical components.
  - For normal text to text: gemma-3-27b
  - GOOGLE_API_KEY is in .env file - please do not share it with anyone else or commit it to GitHub


**Architecture Diagram**
- TO UPDATE
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant GeminiAPI

    User->>Frontend: Click "Practice Speaking"
    Frontend->>User: Show target word + "Record" button
    User->>Frontend: Record audio (WebAudio API)
    Frontend->>Backend: POST /practice/grade-speech (audio blob)
    Backend->>GeminiAPI: Send audio + target text for transcription & grading
    GeminiAPI->>Backend: Return transcription + pronunciation assessment
    Backend->>Frontend: Return grade + feedback
    Frontend->>User: Display results (score, what they said, tips)
```


---


## Readings in Other Markdown Files
- agents.md
  - Coding standards, naming convention, formatting
  - Initial project structure
  - Do's and don'ts
  - Testing guidelines
  - Error handling
  - Git conventions
- assignment-instructions.md
  - Original assignment instructions
  - Problem description, expected output
  - Information about Finnish language proficiency levels 0 to A2.2
- curriculum.md
  - Curriculum for Finnish language proficiency levels 0 to A2.2 researched and grouped into topics by LLM



---

## Final Project Structure
```
project/
├── src/
│   ├── backend/          # FastAPI backend application
│   │   ├── routers/      # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── tests/        # Backend tests
│   │   └── ...
│   ├── frontend/         # Next.js frontend application
│   │   ├── app/          # Next.js pages and layouts
│   │   ├── components/   # Reusable UI components
│   │   ├── __tests__/    # Frontend tests
│   │   └── ...
│   └── database/         # Database seeding and vocabulary data
│   │   ├── content/ # quiz content database (split by (1) proficiency levels, (2) topics, (3) sets of 10 questions per topic if there are more than 10 questions)
│   │   ├── vocabulary/ # vocabulary speech practice database
│   │   └── seed_data.json # initial seed data for the 'content' database ONLY (with the help of another Claude Opus LLM to research and generate "level0 - 01_alphabet questions", expanding from 2 questions to 75 questions)
├── Dockerfile            # Multi-stage Dockerfiles (frontend, backend, full frontend-backend)
├── docker-compose.yml    # Development Docker Compose (serve frontend, backend in 2 separate containers)
├── docker-compose.prod.yml    # Production Docker Compose (serve frontend AND backend in 1 container)
├── README.md             # Finnish Learner Website documentation
├── agents.md # Antigravity IDE agent instructions
├── assignment-instructions.md # Original assignment instructions
├── curriculum.md # Curriculum for Finnish language proficiency levels 0 to A2.2 researched and grouped into topics by LLM
└── ...
```


---

## Frontend
TODO ADD DOCUMENTATION: Front-end is functional, well-structured, and includes tests covering core logic, with clear instructions on how to run them. (3 points)


---

## API contract (OpenAPI specifications)

TODO ADD DOCUMENTATION: OpenAPI specification fully reflects front-end requirements and is used as the contract for backend development. (2 points)

---

## Backend
TODO ADD DOCUMENTATION: Back-end is well-structured, follows the OpenAPI specifications, and includes tests covering core functionality, clearly documented. (3 points)


---

## Database

TODO ADD DOCUMENTATION: Database layer is properly integrated, supports different environments (e.g. SQLite and Postgres), and is documented. (2 points)

> [!NOTE]
> * **Database Persistence**: The SQLite database (`finnish_app.db`) is stored in the `/data` directory inside the backend container. In `docker-compose.yml`, this is mapped to `./src/database` on your local machine.

### How to verify database location:
1. **On Local Machine**: Check if `project/src/database/finnish_app.db` exists after starting the containers.
  * Launch full container: `cd project`, then `docker compose up -d`
  * TO CHECK: `ls -lh project/src/database/finnish_app.db`
2. **Inside Container**: Run `docker exec -it finnish-backend ls -lh /data/finnish_app.db`.
  * TO CHECK: In the `project` folder, run `docker exec -it finnish-backend ls -lh /data/finnish_app.db`
3. **Check Persistence**: Any changes to `finnish_app.db` on your local machine are reflected inside the container (and vice versa) because they are linked by the Docker volume. Note that if you deploy the container to a production environment or a new container, the database will be lost.




---

## Containerization
TODO ADD DOCUMENTATION: The entire system runs via Docker or docker-compose with clear instructions. (2 points)



---

## Integration testing
TODO ADD DOCUMENTATION: Integration tests are clearly separated, cover key workflows (including database interactions), and are documented. (2 points)

---

## Deployment
TODO ADD DOCUMENTATION: Application is deployed to the cloud with a working URL or clear proof of deployment. (2 points)
WITH STEPS

---

## CI/CD pipeline
TODO ADD DOCUMENTATION: CI/CD pipeline runs tests and deploys the application when tests pass. (2 points)

---

## Reproducibility
TODO ADD DOCUMENTATION: Clear instructions exist to set up, run, test, and deploy the system end-to-end. (2 points)


---