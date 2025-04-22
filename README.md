Here’s a clean and **properly aligned README.md** version for your Movie Ticket Booking App with all the provided content:

---

# 🎬 Movie Ticket Booking App – Setup & Roles Overview

---

### Step 1: Create `.env` File

Create a `.env` file inside the `/server` directory with the following configuration:

```
PORT=8080  
DATABASE=your_mongodb_connection_url  
JWT_SECRET=your_jwt_key  
JWT_EXPIRE=30d  
JWT_COOKIE_EXPIRE=30  
```

---

### Step 2: Install Dependencies

#### 📦 Server Side:

```bash
cd server
npm install
npm start        # or use: nodemon server.js
```

---

#### 🌐 Client Side:

```bash
cd client
npm install
npm run dev
```

---

## 👥 Roles & Permissions

The application includes **three main user roles** with specific permissions:

---

### 🔹 1. Viewer (Not Logged In)

- Can view released showtimes by:
  - Movie (on the home page)
  - Theater (on the cinema page)
  - Cinema (on the schedule page)
- Can view showtimes for today and future dates
- Can view seat availability for released showtimes

---

### 🔹 2. User

Includes all **Viewer** permissions, plus:
- Can purchase tickets for available showtimes
- Can view their purchased tickets

---

### 🔹 3. Admin

Includes all **User** permissions, plus:
- Can view **all showtimes** (including past dates)
- Can manage **cinemas**
- Can manage **theaters**:
  - View theater layout (rows, columns, and seats)
- Can manage **showtimes**:
  - Search, filter, and sort
  - View booked seat details
- Can manage **movies**
- Can manage **user and admin accounts**

---

### 🔹 4. AI Chatbot Support

- Chatbot guides users across the app (for ease of use).

---

## 🖼️ App Screenshots

---

### 🔐 Register  
![Register](https://github.com/user-attachments/assets/03361982-04c7-41e7-9fa6-a3a6e57802b6)

---

### 🔑 Login  
![Login](https://github.com/user-attachments/assets/258278e1-67da-4ca4-9173-2de3c2cdcd0e)

---

### 🏠 Home Page  
![Home](https://github.com/user-attachments/assets/ed53696c-503a-406a-b58b-695ef6033217)

---

### 👤 User Info  
![User Info](https://github.com/user-attachments/assets/e4450469-e659-4fb0-a479-2ca1e08a0c4e)

---

### 🎥 Add Movies  
![Add Movies](https://github.com/user-attachments/assets/5d16fbe7-3931-4de8-b9d0-8cc12d3d1fa0)

---

### 🎭 Add Movies in Theatre  
![Add Movies in Theatre](https://github.com/user-attachments/assets/835c379e-25a2-440f-a9cf-033e7d2a438f)

---

### 📅 Schedule Movies  
![Schedule Movies](https://github.com/user-attachments/assets/3a537461-3d81-463c-bdf2-d2dfed90e356)

---

### 🎫 View Booked Tickets  
![View Tickets](https://github.com/user-attachments/assets/b9bacdca-04c2-4805-b4e9-4c837049724c)

---

### 🪑 Book Movie Ticket Seat  
![Book Seat](https://github.com/user-attachments/assets/d388a500-e66b-43a1-89a0-fc595307d007)

---

### 💳 Payment Page  
![Payment](https://github.com/user-attachments/assets/5020583e-8153-4c30-a054-e1f6612be0c4)

---

## 🛢️ Database Collections

---

### 🎞️ Cinema Collection  
![Cinema Collection](https://github.com/user-attachments/assets/67fceb40-1012-499a-a73c-d4098204c536)

---

### 🎬 Movies Collection  
![Movies Collection](https://github.com/user-attachments/assets/ce771c4a-671b-435f-a4b1-376189fe7b3c)

---

### 🕒 Showtime Collection  
![Showtime Collection](https://github.com/user-attachments/assets/502e372f-3703-45ca-9dd2-d040cf8294ac)

---

### 🎭 Theatre Collection  
![Theatre Collection](https://github.com/user-attachments/assets/d31a1646-dd22-4826-b202-a3a22d394f2b)

---

### 👥 User Collection  
![User Collection](https://github.com/user-attachments/assets/37b6071f-f003-45df-9792-f17eff37b7ef)

---

## 📬 API – Postman Routes  
![Postman Routes](https://github.com/user-attachments/assets/b26267f5-395d-41d0-94f4-cf123a7cd553)

---

Let me know if you'd like a downloadable `README.md` file or need a separate version for GitHub!
