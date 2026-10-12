
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connectDatabase() {
  try {
    const database = await open({
      filename: "./todos.db",
      driver: sqlite3.Database,
    });

    await database.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        done BIT DEFAULT 0
      )
    `);

    console.log("Ansluten till databasen");

    return database;
  } catch (err) {
    console.error(
      "Fel vid anslutning eller skapande av tabell:",
      err.message
    );

    throw err;
  }
}

module.exports = connectDatabase();