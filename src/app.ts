import express, { Application } from "express";
import cors from "cors";
import { ErrorHandler } from "./lib/errors/error-handler";
import apiRouter from "./routes/index";

export default async (app: Application): Promise<void> => {
  app.use(cors());
  app.use(express.static(__dirname + "/public")); // Serving static files

  app.use(apiRouter); 

  // error handling 
  app.use(ErrorHandler);
};