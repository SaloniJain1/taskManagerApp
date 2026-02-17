# Task Manager Application

A robust full-stack task management application built with Spring Boot and Angular.

## Features
- **Manual ID Assignment**: Users can specify unique IDs for tasks.
- **Full CRUD**: Create, Read, Update, and Delete tasks.
- **Advanced Filtering**: Filter tasks by completion status.
- **Pagination & Sorting**: Efficiently manage large task lists.
- **Modern UI**: Built with Angular 17, featuring smooth transitions and clear error handling.
- **Robust Logic**: Backend validation for duplicate IDs (409 Conflict) and missing resources (404 Not Found).

## Tech Stack
- **Backend**: Spring Boot 3, Java 17, Spring Data JPA, PostgreSQL, Lombok, JUnit 5, Mockito.
- **Frontend**: Angular 17, TypeScript, Playwright (E2E Testing).
- **Infrastrucutre**: Docker, Docker Compose.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Maven (optional, if running backend locally)
- Node.js & npm (optional, if running frontend locally)

### Running with Docker
1. Clone the repository.
2. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:8080/api/tasks](http://localhost:8080/api/tasks)

### Running Tests
- **Backend Unit Tests**: `mvn test` in `backend/`
- **Frontend E2E Tests**: `npx playwright test` in `frontend/`

### Note :
This Application was build using an AI powered coding assistant to generate files as encouraged. However, the primary design, logic and giving appropriate prompts was solely done by me. 
