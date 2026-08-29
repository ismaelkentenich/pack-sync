import { useCallback } from "react";
import * as application from "@features/auth/application";

export function useAuthOperations() {
  const login = useCallback(
    async (email: string, password: string) => {
      return application.login(email, password);
    },
    [],
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      return application.signup(email, password);
    },
    [],
  );

  const logout = useCallback(async () => {
    return application.logout();
  }, []);

  return {
    login,
    signup,
    logout,
  };
}
