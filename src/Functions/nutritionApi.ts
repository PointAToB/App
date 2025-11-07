import { api_root_url } from "../Settings/constants";
import { getToken } from "./keychain";

const base = api_root_url + "nutrition/";

async function authHeaders() {
    const access = await getToken("access");
    return { "Content-Type": "application/json", Authorization: `Bearer ${access}` };
  }

export async function fetchNutritionLog() {
  const res = await fetch(base + "log", { headers: await authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch log");
  return await res.json();
}

export async function updateNutritionLog(values: Partial<Record<"calories"|"carbs"|"protein"|"fiber"|"fat", number>> & { add?: Record<string, number> }) {
  const res = await fetch(base + "log", {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Failed to update log");
  return await res.json();
}

export async function resetNutritionLog() {
  const res = await fetch(base + "reset", { method: "POST", headers: await authHeaders() });
  if (!res.ok) throw new Error("Failed to reset");
  return await res.json();
}

export async function fetchRecipes() {
  const res = await fetch(base + "recipes", { headers: await authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return await res.json();
}

export async function fetchRecipe(id: number) {
  const res = await fetch(base + `recipes/${id}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return await res.json();
}