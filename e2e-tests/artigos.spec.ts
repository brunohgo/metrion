import { test, expect } from "@playwright/test";

test("abrir um artigo dedicado a partir do catálogo", async ({ page }) => {
  await page.goto("/artigos.html");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Artigos Técnicos");

  const primeiroArtigo = page.getByRole("link", { name: /Ler Análise Completa/i }).first();
  await expect(primeiroArtigo).toHaveAttribute(
    "href",
    "/artigos/incerteza-medicao-tolerancia.html",
  );
  await primeiroArtigo.click();

  await expect(page).toHaveURL(/\/artigos\/incerteza-medicao-tolerancia\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Incerteza de Medição vs Tolerância",
  );
});
