# 🧁 Sweet Shop Management System

## ✨ Manage Your Sweets with Ease!

A simple and interactive Sweet Shop Management System built using **Node.js**, **Express**, **MongoDB Atlas**, and **Vanilla JS** for a delightful user experience. This system empowers you to effortlessly manage your sweet inventory with robust features like adding, editing, deleting, purchasing, restock, and searching.

## 📁 Project Structure

Our project is neatly organized for clarity and maintainability:

## 🚀 Key Features & Capabilities

Discover what you can do with the Sweet Shop Management System:

- ✅ **Full CRUD Operations:** Easily **Add**, **View**, **Edit**, and **Delete** sweet entries.

- 📸 **Image Integration:** Seamlessly **Upload and Store Images** for each sweet directly in MongoDB.

- 🛒 **Inventory Control:** Efficiently **Purchase** sweets (decreasing stock) and **Restock** them (increasing stock).

- 🔍 **Smart Search:** Quickly find sweets by **Name**, **Category**, or within a specific **Price Range**.

- 🖥️ **Intuitive Frontend:** A responsive and interactive **Single-Page Application (SPA)** crafted with pure **Vanilla JavaScript**, HTML, and CSS.

- 🧪 **Robust Testing:** Fully tested with **Jest** and **MongoDB Memory Server** to ensure reliability and stability.

## 🛠️ Quick Setup Guide

Get your Sweet Shop Management System up and running in no time!

### 1. ⬇️ Clone the Repository

Open your terminal or command prompt and run:

git clone https://github.com/your-username/sweet-shop.git
cd sweet-shop

### 2. 📦 Install Dependencies

Navigate into the cloned project directory and install all necessary packages:

npm install

### 3. 🔑 Configure Environment Variables (`.env`)

Create a file named `.env` in the root of your project and add your configuration:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

**Important:** Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

### 4. ▶️ Run the Application

Start the backend server:

npm start

You should see a message indicating the backend is running, typically on `http://localhost:5000`.

### 5. 🌐 Open the Frontend Interface

Once your backend is active, you can access the user interface:

- **Locate your `public` folder** within the project directory.

- Inside `public`, **find the `index.html` file**.

- **Right-click** on `index.html` and choose **"Open with"** your preferred web browser (e.g., Chrome, Firefox, Edge).

Your interactive Sweet Shop Management dashboard will now load in your browser!

## ⚡ API Endpoints

This section outlines the primary API endpoints available for interacting with the Sweet Shop Management System.

| HTTP Method | Endpoint               | Description                                    |
| :---------- | :--------------------- | :--------------------------------------------- |
| `POST`      | `/sweets`              | Add a new sweet to the inventory.              |
| `GET`       | `/sweets`              | Retrieve a list of all available sweets.       |
| `GET`       | `/sweets/search`       | Search for sweets by name, category, or price. |
| `GET`       | `/sweets/:id`          | Retrieve details of a specific sweet by ID.    |
| `PUT`       | `/sweets/:id`          | Update details of an existing sweet by ID.     |
| `DELETE`    | `/sweets/:id`          | Remove a sweet from the inventory by ID.       |
| `POST`      | `/sweets/:id/purchase` | Record a purchase, decreasing sweet quantity.  |
| `POST`      | `/sweets/:id/restock`  | Restock sweets, increasing their quantity.     |

---

## 🧪 Test Cases

This project comes with a comprehensive suite of automated tests using Jest to ensure all API features function as expected against your MongoDB Atlas instance.

### ✅ How to Run All Tests

Execute the tests from your project root:

npm test
