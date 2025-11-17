import { api_root_url } from "../Settings/constants";
import { authFetch } from "./auth";

const base = "nutrition/";

export async function fetchNutritionLog() {
  const res = await authFetch(base + "log");
  if (!res.ok) throw new Error("Failed to fetch log");
  return await res.json();
}

export async function updateNutritionLog(values: Partial<Record<"calories"|"carbs"|"protein"|"fiber"|"fat", number>> & { add?: Record<string, number> }) {
  const res = await authFetch(base + "log", {
    method: "PUT",
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Failed to update log");
  return await res.json();
}

export async function resetNutritionLog() {
  const res = await authFetch(base + "reset", { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset");
  return await res.json();
}

export async function fetchRecipes() {
  const res = await authFetch(base + "recipes");
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return await res.json();
}

export async function fetchRecipe(id: number) {
  const res = await authFetch(base + `recipes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return await res.json();
}