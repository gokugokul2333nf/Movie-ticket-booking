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

7. 
     ![Screenshot 2025-04-22 220815](https://github.com/user-attachments/assets/258278e1-67da-4ca4-9173-2de3c2cdcd0e)
   LOGIN----------------------------------------------------------------------------------------------------------

   
   ![Screenshot 2025-04-22 220605](https://github.com/user-attachments/assets/ed53696c-503a-406a-b58b-695ef6033217)
   HOME-----------------------------------------------------------------------------------------------------------

   
   ![Screenshot 2025-04-22 220623](https://github.com/user-attachments/assets/e4450469-e659-4fb0-a479-2ca1e08a0c4e)
   USER INFO -----------------------------------------------------------------------------------------------------

   
   ![Screenshot 2025-04-22 220715](https://github.com/user-attachments/assets/5d16fbe7-3931-4de8-b9d0-8cc12d3d1fa0)
   ADD-MOVIES-----------------------------------------------------------------------------------------------------

   
![Screenshot 2025-04-22 220801](https://github.com/user-attachments/assets/835c379e-25a2-440f-a9cf-033e7d2a438f)
ADD-MOVIES IN THEATRE---------------------------------------------------------------------------------------------


![Screenshot 2025-04-22 220744](https://github.com/user-attachments/assets/3a537461-3d81-463c-bdf2-d2dfed90e356)
SCHEDULE-MOVIES---------------------------------------------------------------------------------------------------


![Screenshot 2025-04-22 220730](https://github.com/user-attachments/assets/b9bacdca-04c2-4805-b4e9-4c837049724c)
VIEW-BOOKED-TICKET------------------------------------------------------------------------------------------------





