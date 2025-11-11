import { StyleSheet } from "react-native";
import Theme from "@theme/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Theme.colors.neutral[900],
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Theme.colors.neutral[700],
  },
  button: {
    backgroundColor: Theme.colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: Theme.colors.neutral[50],
    fontSize: 16,
    fontWeight: "bold",
  },
});
