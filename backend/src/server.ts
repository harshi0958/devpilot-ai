import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║          DevPilot AI Backend             ║
╠══════════════════════════════════════════╣
║ Status : Running                         ║
║ Port   : ${PORT}                            ║
║ Mode   : ${process.env.NODE_ENV || "development"}              ║
╚══════════════════════════════════════════╝
  `);
});

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down server...`);

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));