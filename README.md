
design Architecture
=======
# taskmanager

This project implements a serverless task management system using AWS services to provide scalable, secure, and maintainable functionality for team members and admins.

Components Overview
Frontend (React with Next.js)

Users authenticate via AWS Cognito (OIDC).

The TeamPage displays assigned tasks fetched from the backend API.

Users can filter tasks by status and update task statuses.

Notification messages alert users of tasks due soon.

Routing logic ensures role-based access (team vs admin).

API Gateway

Acts as the HTTP endpoint for frontend requests.

Routes task-related requests (e.g., GET /get-tasks, POST /update-task) to Lambda functions.

Configured with CORS to allow secure cross-origin requests from the frontend domain.

AWS Lambda Functions

GetTasks Lambda: Queries the DynamoDB TasksTable to retrieve all tasks.

UpdateTask Lambda: Updates the status of a specific task in DynamoDB.

Both functions return JSON responses with appropriate CORS headers.

Error handling returns meaningful HTTP status codes.

DynamoDB

NoSQL database storing task items.

Each task has fields: taskId, title, description, assignedTo (email), status, createdAt, and optional deadline.

Supports fast, scalable access to tasks by Lambda functions.

AWS Cognito

Manages user authentication and authorization.

Provides JWT tokens consumed by the frontend and Lambda for secure access control.

User groups (e.g., admingroup) enable role-based routing.

Data Flow
User Authentication:

User logs in via Cognito.

Access token with user info (email, groups) is available in frontend.

Fetching Tasks:

Frontend calls GET /get-tasks API Gateway endpoint with user's access token.

API Gateway triggers GetTasks Lambda.

Lambda scans TasksTable in DynamoDB and returns all tasks.

Frontend filters tasks assigned to the logged-in user's email.

Tasks are displayed, and notifications for deadlines within 24 hours are shown.

Updating Task Status:

Frontend sends POST /update-task with updated task status.

API Gateway triggers UpdateTask Lambda.

Lambda updates the task status in DynamoDB.

Frontend updates UI on success.

Security and Scalability
Serverless architecture reduces infrastructure management overhead.

AWS IAM roles and policies secure Lambda and DynamoDB access.

CORS configuration restricts frontend API access.

DynamoDB scalability ensures efficient handling of task data.

Cognito integration provides secure authentication and role-based authorization.





GTP Task Manager App
A serverless task management system designed for field teams, leveraging AWS services and built with Next.js.

Overview
This application enables efficient task assignment, tracking, and management for field teams. By utilizing AWS serverless technologies, it ensures scalability, reliability, and cost-effectiveness.

Features
Task Assignment: Assign tasks to field agents seamlessly.

Real-time Updates: Monitor task progress in real-time.

User Authentication: Secure login and access control.

Responsive Design: Optimized for both desktop and mobile devices.

Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS

Backend: AWS Lambda, API Gateway, DynamoDB

Authentication: AWS Cognito

CI/CD: GitLab CI/CD
GitHub Docs

Getting Started
Prerequisites
Node.js (v14 or later)

npm or yarn

AWS account with necessary permissions

<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


cd gtp_taskmanagerapp
Install dependencies:

bash

npm install
# or
yarn install
Configure environment variables:

Create a .env.local file in the root directory and add the necessary environment variables:

env

AWS_REGION=your-aws-region
COGNITO_USER_POOL_ID=your-cognito-user-pool-id
COGNITO_APP_CLIENT_ID=your-cognito-app-client-id
API_GATEWAY_URL=your-api-gateway-url
Run the development server:

bash

npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the application in action.

Project Structure
bash
Copy
Edit
├── app/                 # Main application components
├── components/          # Reusable UI components
├── public/              # Static assets
├── utils/               # Utility functions
├── .gitignore           # Git ignore rules
├── .gitlab-ci.yml       # GitLab CI/CD configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
Deployment
The application is configured for deployment using GitLab CI/CD pipelines. Ensure that your GitLab repository has the necessary environment variables set up for AWS deployment.