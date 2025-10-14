import express from "express";
import v1Router from "./routes/v1";
import { config } from "./env.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import connectDB from "./db/connect.db";
import morgan from "morgan";

const app = express();
const PORT = config.PORT;

if (config.ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

const corsOptions = {
  origin: config.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World! from create-tall");
});

app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
