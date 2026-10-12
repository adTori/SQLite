
const databasePromise = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// READ - Hämta alla todos
app.get("/todos", async (req, res) => {
  try {
    const database = await databasePromise;
    const todos = await database.all("SELECT * FROM todos");
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/todos", async (req, res) => {
  try {
    const database = await databasePromise;
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({
        error: "Du måste ange en uppgift",
      });
    }

    const result = await database.run(
      "INSERT INTO todos (task) VALUES (?)",
      [task]
    );

    res.status(201).json({
      id: result.lastID,
      task: task,
      done: 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/todos/:id", async (req, res) => {
  try {
    const database = await databasePromise;
    const { id } = req.params;
    const { task, done } = req.body;

    const result = await database.run(
      "UPDATE todos SET task = ?, done = ? WHERE id = ?",
      [task, done, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Todo hittades inte",
      });
    }

    res.json({
      id: Number(id),
      task,
      done,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/todos/:id", async (req, res) => {
  try {
    const database = await databasePromise;
    const { id } = req.params;

    const result = await database.run(
      "DELETE FROM todos WHERE id = ?",
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Todo hittades inte",
      });
    }

    res.json({
      message: "Todo har tagits bort",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Starta servern
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});