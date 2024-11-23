"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import originControl from "./src/middlewares/corsMiddleware";
// import config from "./src/config/index";
const port = 3000;
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    return console.log(`Express is listening -- at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map