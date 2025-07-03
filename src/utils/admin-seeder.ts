import { prisma } from "../services/prisma.service";
import bcrypt from "bcrypt";

export class AdminSeeder {
  static async createInitialAdmin() {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "admin" },
            { email: "admin@admin.com" },
            { isAdmin: true },
          ],
        },
      });

      if (existingAdmin) {
        console.log("✅ Admin user already exists");
        console.log(`📧 Admin email: ${existingAdmin.email}`);
        return existingAdmin;
      }

      // Create initial admin user
      const hashedPassword = await bcrypt.hash("admin", 10);

      const admin = await prisma.user.create({
        data: {
          email: "admin",
          firstName: "System",
          lastName: "Administrator",
          password: hashedPassword,
          isAdmin: true,
          isActive: true,
        },
      });

      console.log("🎉 Initial admin user created successfully!");
      console.log("==========================================");
      console.log("📧 Email: admin");
      console.log("🔑 Password: admin");
      console.log("👤 Role: Administrator");
      console.log("==========================================");
      console.log(
        "⚠️  IMPORTANT: Please change the default password after first login for security!"
      );
      console.log("==========================================");

      return admin;
    } catch (error) {
      console.error("❌ Failed to create initial admin user:", error);
      throw error;
    }
  }
}
