# 🍽️ Yumzy – Food Ordering Platform

Yumzy is a full-stack **MERN-based food ordering web application** with **multi-role support** including **User, Admin, and Restaurant Owner dashboards**.

---

## 🚀 Live Demo

* 🌐 Frontend: https://yumzy-food-ordering.vercel.app
* ⚙️ Backend: https://yumzy-food-ordering.onrender.com

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Tailwind CSS (if used)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Razorpay Payment Integration
* Cloudinary (Image Upload)

---

## 👥 User Roles & Features

### 🧑‍💻 User Panel

* 🔐 Signup / Login
* 🍔 Browse restaurants & menus
* 🔍 Search & filter food items
* 🛒 Add to cart & place orders
* 💳 Secure payments via Razorpay
* 📦 View previous orders
* ✏️ Update profile information

---

### 🏪 Restaurant Owner Panel

* ➕ Add / update food items
* 📋 Manage menu
* 📦 View incoming orders
* ✅ Confirm / update order status
* 📊 Track restaurant performance

---

### 🛠️ Admin Panel

* 👥 Manage users
* 🏪 Manage restaurant owners
* ✔️ Approve / control restaurants
* 📦 Monitor all orders
* ⚙️ Full system control

---

## 📁 Project Structure

```
yumzy
 ├── Yumzy-backend
 │    ├── src
 │    ├── routes
 │    ├── controllers
 │    └── config
 │
 ├── Yumzy-frontend
 │    ├── src
 │    ├── components
 │    ├── pages
 │    └── dashboards
 │
 ├── README.md
 └── .gitignore
```

---

## ✨ Key Features

* 🔐 Role-Based Authentication (User / Admin / Owner)
* 🍽️ Dynamic Restaurant Listings
* 🛒 Cart & Order System
* 💳 Razorpay Payment Integration
* 📦 Real-Time Order Management
* 🌐 Fully Deployed Application
* 🔒 Secure API with JWT

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/Yumzy-Food-ordering.git
cd Yumzy-Food-ordering
```

---

### 2️⃣ Backend Setup

```
cd Yumzy-backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd Yumzy-frontend
npm install
npm run dev
```

---

## 🌍 Environment Variables

| Variable            | Description               |
| ------------------- | ------------------------- |
| MONGO_URI           | MongoDB connection string |
| JWT_SECRET          | Authentication secret     |
| RAZORPAY_KEY_ID     | Razorpay key              |
| RAZORPAY_KEY_SECRET | Razorpay secret           |

---

## ⚠️ Important Notes

* ❌ Never upload `.env` file
* ⚡ Backend may take time to start (Render free tier)
* 🔐 Keep API keys secure

---

## 🤝 Contributing

Pull requests are welcome!

---

## 📧 Contact

👤 **Dhruvang**
GitHub: https://github.com/Dhruvang0011

---

## ⭐ Support

If you like this project, give it a ⭐!
