// const express = require("express");
// const sqlite3 = require("sqlite3");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// app.use(express.json());
// const express = require("express");
// const sqlite3 = require("sqlite3");
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

app.use(express.json());

const db = new sqlite3.Database("peertutoringdb.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("connected to the database");
});

app.get("/api/tutors/:id", (req, res) => { 
  const id = req.params.id;
  db.all("SELECT * FROM tutors WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

