Movie Ticket Booking App – Setup & Roles Overview
How to Run the App
-----------------------------------------------------------------------------------------------

Step 1: Create .env File
Create a .env file inside the /server directory with the following configuration:

PORT=8080
DATABASE=your_mongodb_connection_url
JWT_SECRET=your_jwt_ke
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
-----------------------------------------------------------------------------------------------
Step 2: Install Dependencies

Server Side:

cd server
npm install
npm start        # or use: nodemon server.js
-----------------------------------------------------------------------------------------------

Client Side:

cd client
npm install
npm run dev
-----------------------------------------------------------------------------------------------

Roles & Permissions
The application includes three types of users with specific access rights:

1. Viewer (Not Logged In)

- Can view released showtimes by:
  - Movie (on the home page)
  - Theater (on the cinema page)
  - Cinema (on the schedule page)
- Can view showtimes for today and future dates
- Can view seat availability for released showtimes
-----------------------------------------------------------------------------------------------

2. User

Includes all Viewer permissions, plus:
- Can purchase tickets for available showtimes
- Can view their purchased tickets
-----------------------------------------------------------------------------------------------

3. Admin

Includes all User permissions, plus:
- Can view all showtimes (including past dates)
- Can manage cinemas
- Can manage theaters:
  - View theater layout (rows, columns, and seats)
- Can manage showtimes:
  - Search, filter, and sort
  - View details of booked seats
- Can manage movies
- Can manage user and admin accounts

4. with chat bot

5. ![Screenshot 2025-04-22 220826](https://github.com/user-attachments/assets/03361982-04c7-41e7-9fa6-a3a6e57802b6)
6. REGISTER-------------------------------------------------------------------------------------------------------
     ![Screenshot 2025-04-22 220815](https://github.com/user-attachments/assets/258278e1-67da-4ca4-9173-2de3c2cdcd0e)
   LOGIN----------------------------------------------------------------------------------------------------------
