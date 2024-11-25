import express, { Express, Request, Response } from "express";
const app: Express = express();

import dotenv from "dotenv";
dotenv.config();
import initDB from "./src/config/mongodb";
import originControl from "./src/middlewares/corsMiddleware";
import config from "./src/config";
// import config from "./src/config/index";

// middlewares
app.use(express.json());
app.use(originControl);
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
//
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "I am functional !",
    data: null,
  });
});
//
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});
//
async function bootstrap() {
  const server = app.listen(config.port, async () => {
    console.log(`Server running on port ${config.port}`);
    // initialize the database
    initDB();
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
    }
    process.exit(1);
  };
  const unexpectedErrorHandler = (error: Error) => {
    console.log(error);
    exitHandler();
  };
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}
bootstrap();
