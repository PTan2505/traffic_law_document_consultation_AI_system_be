import express, { Application } from "express";
import cors from "cors";
import { ErrorHandler } from "./common/errors/error-handler";
import apiRouter from "./routes/index";
import { setupSwagger } from "./config/swagger";
import path from "path";

export default async (app: Application): Promise<void> => {
  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/public")); // Serving static files

  // Serve the HTML test client at root
  app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "api-test-client.html"));
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      message: "Vietnamese Traffic Law Chatbot API is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        "API Documentation": "/docs",
        "Test Client": "/",
        "API Base": "/api/v1",
      },
    });
  });

  // Setup Swagger
  setupSwagger(app);

  // API Routes
  app.use(apiRouter);

  // Error handling
  app.use(ErrorHandler);
};
