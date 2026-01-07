const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const USERS = {};      // username -> token
const MESSAGES = [];  // encrypted messages

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

/* LOGIN */
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username required" });

  let token = USERS[username];
  if (!token) {
    token = generateToken();
    USERS[username] = token;
  }

  res.json({ token });
});

/* SEND MESSAGE */
app.post("/send", (req, res) => {
  const { token, to, msg } = req.body;

  const from = Object.keys(USERS).find(u => USERS[u] === token);
  if (!from) return res.status(401).json({ error: "invalid token" });

  MESSAGES.push({ from, to, msg });
  res.json({ ok: true });
});

/* RECEIVE MESSAGE */
app.get("/recv/:token", (req, res) => {
  const token = req.params.token;
  const user = Object.keys(USERS).find(u => USERS[u] === token);
  if (!user) return res.status(401).json({ error: "invalid token" });

  const msgs = MESSAGES.filter(m => m.to === user);
  res.json(msgs);
});

app.listen(3000, () => console.log("Veilo server running"));
