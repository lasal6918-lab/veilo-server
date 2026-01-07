
// veilo minimal relay server
const express = require("express");
const app = express();
app.use(express.json());

const inbox = {}; // RAM-only (server restart হলে clear)

app.post("/send", (req, res) => {
  const { to, data } = req.body;
  if (!to || !data) return res.status(400).send("bad request");
  inbox[to] = inbox[to] || [];
  inbox[to].push(data); // encrypted blob
  res.send("ok");
});

app.get("/recv/:user", (req, res) => {
  const user = req.params.user;
  const msgs = inbox[user] || [];
  inbox[user] = [];
  res.json(msgs); // encrypted blobs
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Veilo relay running"));
