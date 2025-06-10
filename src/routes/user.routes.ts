import { Router, Request, Response, NextFunction, json } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.use(json());
router
  .route("/")
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.create(req, res);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.findAll(req, res);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.findOne(req, res);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.update(req, res);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userController.delete(req, res);
    } catch (error) {
      next(error);
    }
  });

export default router;
