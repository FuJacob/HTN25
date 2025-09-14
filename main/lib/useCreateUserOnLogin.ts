"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export const useCreateUserOnLogin = () => {
  const { user, isLoading } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const createUserInDB = async () => {
      if (user && !creating && !dbUser) {
        setCreating(true);
        try {
          const response = await fetch("/api/auth/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setDbUser(data.user);
          } else {
            console.error("Failed to create user in database");
          }
        } catch (error) {
          console.error("Error creating user:", error);
        } finally {
          setCreating(false);
        }
      }
    };

    if (!isLoading && user) {
      createUserInDB();
    }
  }, [user, isLoading, creating, dbUser]);

  return {
    user,
    dbUser,
    isLoading: isLoading || creating,
  };
};
