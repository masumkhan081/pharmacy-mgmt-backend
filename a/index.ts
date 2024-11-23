import express, { Express, Request, Response } from "express";
const app: Express = express();
 
import dotenv from "dotenv";
dotenv.config();
import initDB from "./src/config/mongodb";
import originControl from "./src/middlewares/corsMiddleware";
import config from "./src/config";
// import config from "./src/config/index";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(config.port, () => {
  return console.log(
    `Express is listening - at http://localhost:${config.port}`
  );
});
