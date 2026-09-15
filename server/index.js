const express = require("express");

const app = express();
const port = process.env.PORT || 9106;

app.get("/api/greeting", (req, res) => {
  res
    .type("text/plain")
    .send(`hello world oxzoo-react-yarn_${process.env.GREETING_TAG}`);
});

app.get("/health", (req, res) => {
  res.type("text/plain").send("ok");
});

app.listen(port, "127.0.0.1", () => {
  console.log(`oxzoo-react-yarn API listening on http://127.0.0.1:${port}`);
});
