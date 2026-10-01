require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function initDb() {

    const dbPath = process.env.DB_PATH || "./database/blogging.db";

    const schemaPath = path.join(
        __dirname,
        "database",
        "schema.sql"
    );

    const schema = await fs.readFile(
        schemaPath,
        "utf8"
    );

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(schema);

    await db.close();

    console.log("Database initialized successfully.");
}

initDb().catch((error) => {

    console.error("Database initialization failed:", error);
    process.exit(1);
});