/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill for SlowBuffer in Node 22+ / future Node versions for legacy jsonwebtoken / jwa / buffer-equal-constant-time
// eslint-disable-next-line @typescript-eslint/no-require-imports
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

import app from "./app";
import config from "./config";

async function bootstrap() {
  let server: any;

  try {
    server = app.listen(config.port, async () => {
      console.log(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed.");
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
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${config.port} is already in use.`);
      process.exit(1);
    } else {
      console.error("Unexpected error while starting the server:", error);
      process.exit(1);
    }
  }
}
bootstrap();
