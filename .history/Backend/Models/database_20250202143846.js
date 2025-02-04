import pg from "pg";

const db = new pg.Client({
    database : "Workindia",
    password : "Raj@143225",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();

export default db;
