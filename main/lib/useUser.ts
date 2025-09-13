import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";

export function useUser() {
  const { user, error, isLoading } = useAuth0User();
  return { user, error, isLoading };
}
