import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import peopleRoutes from "./routes/people.routes";
import eprRoutes from "./routes/epr.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", peopleRoutes);
app.use("/api", eprRoutes);
app.get("/", (req, res) => {
  res.send("Skynet EPR API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});