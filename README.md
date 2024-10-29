# CalPal

## Overview
CalPal is a calorie tracking web application developed using the MERN stack. Items are categorized to foods and dishes, where dishes are composed of multiple foods.

## Features
- User Registration and Authentication.
- Modifying of user data.
- Changing of user password.
- Current day food eaten metrics. 
- Creating of foods and dishes.
- Adding of foods and dishes eaten.
- Modifying of created foods and dishes.
- Modifying of foods and dishes eaten.
- Deletion of created foods and dishes.
- Deletion of foods and dishes eaten.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Deployment:**
    - **Frontend and Backend:** Deployed on Vercel

## Website
[calpal-nsem.vercel.app](https://calpal-nsem.vercel.app/)

## Installation and Setup 
To run this project locally, follow these steps:

### Prerequisites
- Node.js
- MongoDB

### Installation
1. **Clone the repository:**
    ```
    git clone https://github.com/nathanaelmemis/calpal.git
    ```
2. **Navigate to the project directory:**
    ```
    cd calpal
    ```
3. **Install the dependencies:**
    ```
    npm install
4. **Set up the environment variables:**
    - Create a `.env` file in the backend directory.
    - Configure your environment variables in the `.env` file. Use the provided `.env` example as a template.
    ```plaintext
    MONGO_PASSWORD=your_mongo_password
    SECRET_KEY=you_secret_key
    ```
5. **Set up MongoDB URI:**
    - Modify the uri constant in `backend/database.ts` to your MongoDB uri.
6. **Start the frontend development server:**
    ```
    cd frontend && npm run dev
    ```
7. **Start the backend development server:**
    ```
    cd backend && npm run dev
    ```