import { Router, Request, Response, NextFunction } from "express";

const testRouter = Router(); 

testRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "Test get request received!" });
  } catch (err) {
    next(err); 
  }
});

// Example with auth middleware (uncomment and implement as needed):
// testRouter.get("/protected-route", UserAuth, async (req: Request, res: Response, next: NextFunction) => { /* ... */ });

export default testRouter; 
