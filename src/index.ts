/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "./app";
import initDB from "./config/mongodb";
import config from "./config";
//np
async function bootstrap() {
  let server: any;

  try {
    server = app.listen(config.port, async () => {
      console.log(`Server running on port ${config.port}`);
      // Initialize the database
      await initDB();
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
    // process.on("SIGINT", exitHandler); // Handle Ctrl+C
    // process.on("SIGTERM", exitHandler); // Handle termination
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
