require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const dbPromise = require("./db");
const articleRoutes = require("./api/articles");
const authRoutes = require("./api/auth");
const avatarRoutes = require("./api/avatars");
const notificationRoutes = require("./api/notifications");
const subscriptionRoutes = require("./api/subscriptions");
const tagRoutes = require("./api/tags");
const userRoutes = require("./api/users");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use("/api", avatarRoutes);
app.use("/api", notificationRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", tagRoutes);
app.use("/api", userRoutes);

app.use("/uploads", express.static("uploads"));

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