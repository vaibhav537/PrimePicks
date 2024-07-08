import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/userRoutes";
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", router);
app.use("/", router);

const PORT = process.env.SERVERPORT;
app.listen(PORT, () => {
  console.log(`THE SERVER OF PRIMEPICKS RUNNING AT : ${PORT} port!`);
});
