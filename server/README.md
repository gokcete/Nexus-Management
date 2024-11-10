
# Backend Development Guide: Hotel Management System

## Overview

This guide is intended to help the backend team develop the Hotel Management System, including both the admin panel and customer website. The system should handle user roles, booking management, room management, and customer management efficiently.

---

## Technologies

- **Node.js**: Server-side programming.
- **Express.js**: RESTful API framework.
- **MongoDB**: Database management.
- **Mongoose**: ODM for MongoDB.
- **Next.js**: Server-rendered React framework for frontend integration.
- **JWT**: For secure authentication.

---

## Database Schema

The Hotel Management System database will primarily use MongoDB. Below are the details of the database schema, including data types and relationships.

### 1. User

Stores details of the users in the system, which could be admin, staff, or customers.

- **Schema:**
    ```json
    {
        "_id": ObjectId, // Primary Key
        "name": String,
        "email": { type: String, unique: true, required: true },
        "password": String,
        "role": { type: String, enum: ["admin", "staff", "customer"], required: true },
        "created_at": { type: Date, default: Date.now },
        "updated_at": { type: Date, default: Date.now }
    }
    ```

- **References:**
    - The `role` field determines the access level within the system.

### 2. Room

Stores details of each room in the hotel.

- **Schema:**
    ```json
    {
        "_id": ObjectId, // Primary Key
        "room_number": { type: String, unique: true, required: true },
        "type": { type: String, enum: ["single", "double", "suite"], required: true },
        "price_per_night": { type: Number, required: true },
        "status": { type: String, enum: ["available", "booked", "maintenance"], default: "available" },
        "created_at": { type: Date, default: Date.now },
        "updated_at": { type: Date, default: Date.now }
    }
    ```

- **References:**
    - Room status can be updated based on booking status or maintenance requirements.

### 3. Booking

Stores details of all room bookings.

- **Schema:**
    ```json
    {
        "_id": ObjectId, // Primary Key
        "user_id": { type: ObjectId, ref: "User", required: true },
        "room_id": { type: ObjectId, ref: "Room", required: true },
        "check_in_date": { type: Date, required: true },
        "check_out_date": { type: Date, required: true },
        "total_price": { type: Number, required: true },
        "status": { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
        "created_at": { type: Date, default: Date.now },
        "updated_at": { type: Date, default: Date.now }
    }
    ```

- **References:**
    - `user_id` references the User who made the booking.
    - `room_id` references the Room being booked.

### 4. Payment

Stores details of payments made for bookings.

- **Schema:**
    ```json
    {
        "_id": ObjectId, // Primary Key
        "booking_id": { type: ObjectId, ref: "Booking", required: true },
        "amount": { type: Number, required: true },
        "payment_date": { type: Date, default: Date.now },
        "payment_method": { type: String, enum: ["credit_card", "paypal", "bank_transfer"], required: true },
        "status": { type: String, enum: ["completed", "pending", "failed"], default: "pending" }
    }
    ```

- **References:**
    - `booking_id` references the Booking that this payment is associated with.

### 5. Review

Stores customer reviews for their stays.

- **Schema:**
    ```json
    {
        "_id": ObjectId, // Primary Key
        "user_id": { type: ObjectId, ref: "User", required: true },
        "room_id": { type: ObjectId, ref: "Room", required: true },
        "rating": { type: Number, min: 1, max: 5, required: true },
        "comment": { type: String, required: true },
        "created_at": { type: Date, default: Date.now }
    }
    ```

- **References:**
    - `user_id` references the User who left the review.
    - `room_id` references the Room that the review is about.

---

## API Endpoints

### 1. User Endpoints

- **POST /api/users/register**
    - Registers a new user.
    - **Required Fields:** name, email, password, role

- **POST /api/users/login**
    - Logs in a user and returns a JWT token.
    - **Required Fields:** email, password

### 2. Room Endpoints

- **GET /api/rooms**
    - Retrieves all available rooms.

- **POST /api/rooms**
    - Creates a new room (Admin only).
    - **Required Fields:** room_number, type, price_per_night

### 3. Booking Endpoints

- **POST /api/bookings**
    - Creates a new booking.
    - **Required Fields:** user_id, room_id, check_in_date, check_out_date

- **GET /api/bookings/:id**
    - Retrieves details of a specific booking.

### 4. Payment Endpoints

- **POST /api/payments**
    - Records a payment for a booking.
    - **Required Fields:** booking_id, amount, payment_method

---

## Authentication

JWT (JSON Web Token) will be used to secure the API. All endpoints that require authentication will need the JWT token to be passed in the Authorization header.

---

## Error Handling

Ensure to handle errors gracefully by sending appropriate HTTP status codes and messages. Use middleware in Express.js for consistent error handling across the application.

---

## Conclusion

This document provides a comprehensive guide to developing the backend of the Hotel Management System. Follow the schema and endpoints as outlined to ensure a robust and scalable application.
