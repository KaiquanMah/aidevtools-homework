# Project Agent Instructions

## Project Overview
- **Name**: Finnish Language Learner
- **Description**: A web application that helps English users learn and practice their reading, writing, listening and speaking Finnish language skills.
- **Type**: [eg Web app / API / CLI / Library / Mobile app] - Web App

---

## Tech Stack
- **Language**: [e.g., TypeScript, Python, Go] - TypeScript (frontend), Python (backend)
- **Framework**: [e.g., Next.js, FastAPI, Express] - Next.js (frontend), FastAPI (backend)
- **Database**: [e.g., PostgreSQL, MongoDB, Supabase] - SQLite
- **Styling**: [e.g., Tailwind CSS, CSS Modules] - Tailwind CSS
- **Package Manager**: [npm / yarn / pnpm / bun] - npm
- Docker: [yes/no] - yes
- LLMs if needed
  - For speech to text and text to speech: gemini-2.5-flash-native-audio-dialog (live API)
  - For normal text to text: gemma-3-27b

---

## Coding Standards

### General
- Write clean, readable, self-documenting code
- Use meaningful variable and function names
- Keep functions small and single-purpose
- Prefer composition over inheritance

### Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Frontend Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Frontend Functions/Variables**: camelCase
- **Backend Functions/Variables**: snake_case
- **Constants**: SCREAMING_SNAKE_CASE

### Formatting
- Use 2-space indentation
- Max line length: 80-100 characters
- Always use semicolons: [yes/no] - only if needed
- Quote style: [single/double] - double if allowed by syntax convention

---

## Project Structure
```
src/
├── frontend/ # Frontend code
├── backend/ # Backend code
├── database/ # Database
├── tests/ # Tests
├── dev-process/ # Development process documentation
├── agents.md # Antigravity IDE agent instructions
├── Dockerfiles, etc # Containerization
```


---

## Do's ✅
- Always handle errors gracefully
- Add TypeScript types to all frontend functions
- Add JSDoc comments for public frontend functions
- Add Python types to all backend functions
- Use environment variables for secrets
- Write unit tests for all functions
- Validate all user inputs
- Use async/await over .then() chains
- Use try-catch for JS error handling
- Use try-except for Python error handling
- Use meaningful variable and function names
- Have sufficient comments for people to understand your code
- Check back this agents.md file to keep track of your guidelines
- Check context7 MCP server if you want to understand the latest syntax, functions, etc for a library

---

## Don'ts ❌
- Never commit API keys or secrets
- Don't use `any` type in TypeScript
- Avoid deeply nested callbacks
- Don't ignore TypeScript errors with @ts-ignore
- Never trust user input without validation
- Don't leave console.logs in production code
- Avoid magic numbers — use named constants

---

## Testing
- **Framework**: [Jest / Vitest / Pytest]
- Write tests for all new features
- Aim for 80%+ code coverage
- Use descriptive test names: `should [action] when [condition]`

---

## Error Handling
- Use try-catch for async operations
- Return meaningful error messages
- Log errors with context (function name, inputs)
- Use custom error classes when appropriate

---

## Git Conventions
- **Commit format**: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits atomic and focused

---

## Additional Context
[Add any project-specific notes, business logic, or domain knowledge the agent should know]

---

## Example Patterns

### API Call Pattern
```typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('fetchUser failed', { id, error });
    throw new ApiError('Failed to fetch user');
  }
}