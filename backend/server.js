require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const dbPromise = require("./db");
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", userRoutes);

const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
        const db = await dbPromise;
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});