import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { name, email, password } = bodySchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        throw new AppError("Email is already registered.");
      }

      const hashedPassword = await hash(password, 8);

      const response = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...userWithoutPassword } = response;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
