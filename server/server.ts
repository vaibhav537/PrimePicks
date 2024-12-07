import express, { Application } from "express";
import cors from "cors";
import publicRouter from "./routes/publicRoutes";
import protectedRouter from "./routes/protectedRoutes";

const app: Application = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// JSON Parsing Middleware
app.use(express.json());

// Routes
app.use("/api/public", publicRouter);
app.use("/api/protected", protectedRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
