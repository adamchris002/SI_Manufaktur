const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const routes = require("./routes");
app.use(routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});