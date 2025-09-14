"use client";
import { useCreateUserOnLogin } from "../../lib/useCreateUserOnLogin";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dbUser, isLoading } = useCreateUserOnLogin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
