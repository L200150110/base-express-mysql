import express from "express";
import db from "./config/Database.js";
// import Users from "./models/UserModel.js";
import router from "./routes/index.js";
const app = express();

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  // await Users.sync();
} catch (err) {
  console.error("Unable to connect to the database:", err);
}

app.use(express.json());
app.use(router);

app.listen(8000, () => console.log("listening on port 8000"));
