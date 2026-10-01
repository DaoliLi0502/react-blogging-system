const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const dbPath = process.env.DB_PATH || "./database/blogging.db";

const dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database
});

module.exports = dbPromise;