import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/userDTO/user.DTO";

export class UserController {
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, firstName, lastName, password }: CreateUserDTO = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserRepository.createUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Error creating user" });
    }
  };

  findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await UserRepository.findAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching users" });
    }
  };

  findOne = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching user" });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, isActive, isAdmin }: UpdateUserDTO =
        req.body;

      const user = await UserRepository.updateUser(id, {
        email,
        firstName,
        lastName,
        isActive,
        isAdmin,
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error updating user" });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Error deleting user" });
    }
  };
}
