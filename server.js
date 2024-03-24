import app from "./app.js";
import { connectDB } from "./config/db.js";

try {
  connectDB();

  app.listen(5000, () => {
    console.log("Server is up and running!");
  });
} catch (error) {
  console.log(error.message);
}
