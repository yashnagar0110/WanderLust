## Wanderlust 

A full-stack web application built with **Node.js, Express, MongoDB, and EJS** for managing travel listings and reviews. Users can register, log in, create and manage listings, post reviews, and upload images using **Cloudinary**.

---
Live Link : https://wanderlust-3-5n38.onrender.com/listings

## 🚀 Features

- User authentication with **Passport.js** (local strategy)
- Create, edit, and delete **listings**
- Upload images to **Cloudinary** with **Multer**
- Post and manage **reviews**
- Server-side validation with **Joi**
- Session management stored in **MongoDB**
- Flash messages for success/error notifications
- Error handling with custom middleware
- Responsive **EJS views** with layouts via **EJS-Mate**

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: Passport.js (Local strategy + sessions)  
- **File Uploads**: Multer + Cloudinary  
- **Validation**: Joi  
- **Templating**: EJS + EJS-Mate  
- **Styling**: Public static assets (CSS/JS)  
- **Other Tools**: dotenv, connect-flash, method-override  

---

## 📦 Installation

1. Clone the repository:
   git clone https://github.com/yashnagar0110/wanderlust.git
   cd wanderlust

2. Install dependencies:
    npm install

3. Create a .env file in the root directory with the following variables:
    NODE_ENV=development
    ATLASDB_URL=your_mongodb_connection_string
    SECRET=your_session_secret
    CLOUD_NAME=your_cloudinary_name
    CLOUD_API_KEY=your_cloudinary_api_key
    CLOUD_API_SECRET=your_cloudinary_api_secret

4. Start the application:
    node app.js

5. Open in your browser:
    http://localhost:8080

---

## 📂 Project Structure

├── app.js                # Main server file 

├── cloudConfig.js        # Cloudinary configuration

├── middleware.js         # Custom middlewares

├── schema.js             # Joi validation schemas

├── package.json          # Dependencies and scripts

├── routes/               # Express route handlers

├── models/               # Mongoose models

├── views/                # EJS templates

├── public/               # Static assets (CSS, JS, images)

└── utils/                # Utility functions (e.g. ExpressError)

---
