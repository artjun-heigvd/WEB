# Exam Web Backend

## Prerequisites

The following prerequisites must be filled to run this service:

- [Visual Studio Code](https://code.visualstudio.com/download) must be
  installed.

## Start the application for local development

Open this folder in Visual Studio Code, and open it in a dev container. In a
terminal, run the following commands:

```bash
# Install dependencies
npm install

# Run the database migrations
npm run prisma:migrate

# Seed the database with some data
npm run prisma:seed

# Start the application in watch mode (changes to the code will be automatically reloaded)
npm run dev
```

```bash
# One command to rule them all on unix
npm install && npm run prisma:migrate && npm run prisma:seed && npm run dev
```

The application should start. The API documentation is accessible at <http://localhost:3000/api>. You can log in
with the credentials (`user` and
`pass`).
