import { useRouter } from "expo-router";
import { Routes } from "@app/config/routes";

export function useAuthNavigation() {
  const router = useRouter();

  return {
    navigate: (
      route: typeof Routes.Login | typeof Routes.SignUp,
    ) =>
      router.navigate(
        route === Routes.Login ? "/" : "/sign-up",
      ),
  };
}
