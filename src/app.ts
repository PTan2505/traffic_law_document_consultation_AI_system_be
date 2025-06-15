import express, { Application } from "express";
import cors from "cors";
import { ErrorHandler } from "./common/errors/error-handler";
import apiRouter from "./routes/index";
import { setupSwagger } from "./config/swagger";
export default async (app: Application): Promise<void> => {
  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/public")); // Serving static files

  // Setup Swagger
  setupSwagger(app);

  // API Routes
  app.use(apiRouter); 

  // Error handling 
  app.use(ErrorHandler);
};