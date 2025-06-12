import express from "express";
import expressApp from "./app";
import dotenv from "dotenv";
dotenv.config();

const StartServer = async () => {
  const app = express();
  await expressApp(app);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening to port ${port}`);
  })
  .on("error", (err: Error) => {
    console.log(err);
    process.exit();
  });
};

StartServer();