const express = require("express");
const dbPromise = require("./db");

const app = express();

app.use(express.json());

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