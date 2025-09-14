"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default function UserSync() {
  const { user, isLoading } = useUser();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!user || synced || isLoading) return;

      try {
        console.log("🔄 Syncing user to database:", user.email);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { auth0Id: user.sub },
        });

        if (!existingUser) {
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              auth0Id: user.sub,
              email: user.email!,
            },
          });
          console.log("✅ User created:", newUser);
        } else {
          console.log("👤 User already exists:", existingUser);
        }

        setSynced(true);
      } catch (error) {
        console.error("💥 Error syncing user:", error);
      }
    };

    syncUser();
  }, [user, isLoading, synced]);

  return null; // This component doesn't render anything
}
