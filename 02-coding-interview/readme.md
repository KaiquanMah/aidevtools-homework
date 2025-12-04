# End-to-End Application Development

Tool used: Windsurf IDE in agent mode.

Objective:
- Build an end-to-end application with AI.
- The web-based platform/application will be used for online coding interviews

Application Requirements:
- The app should be able to do the following:
    - **Create a link and share it with candidates**
    - Allow everyone who connects to **edit code in the code panel**
    - **Show real-time updates** to all connected users
    - Support **syntax highlighting for multiple languages**
    - **Execute code safely in the browser**

You can choose any technologies you want. For example:
- Frontend: React + Vite
- Backend: Express.js
- We recommend using JavaScript for frontend, because with other technologies, some of the homework requirements may be difficult to implement.



## Question 1: Initial Implementation

Ask AI to implement both frontend and backend - in 1 prompt.

Note: you can also follow the same path as in the videos and make it in 3 steps:

1. Frontend
2. OpenAPI specs
3. Backend

What's the initial prompt you gave to AI to start the implementation? Copy and paste it in the homework form.
```
Enter here later
```

## Question 2: Integration Tests

Write integration tests that check the interaction between client and server works.

Also it's a good idea to ask it to start creating a `TESTS.md` file with all the commands for running and testing your application.

What's the terminal command you use for executing tests?
```
enter here later
```


## Question 3: Running Both Client and Server

Now let's make it possible to run both client and server at the same time. Use `concurrently` for that.

What's the command you have in `package.json` for `npm dev` for running both?
```
enter here later
```

## Question 4: Syntax Highlighting

Let's now add support for syntax highlighting for JavaScript and Python.

Which library did AI use for it?
```
enter here later
```


## Question 5: Code Execution

Now let's add code execution.

For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser.

Which library did AI use for compiling Python to WASM?
```
enter here later
```


## Question 6: Containerization

Now let's containerize our application. Ask AI to help you create a Dockerfile for the application. Put BOTH backend and frontend in 1 container.

What's the BASE IMAGE you used for your Dockerfile?
```
enter here later
```

## Question 7: Deployment

Now let's deploy it. Choose a service to deploy your application.

Which SERVICE did you use for deployment?
```
enter here later
```

