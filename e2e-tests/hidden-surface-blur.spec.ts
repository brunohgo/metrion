import { test, expect } from "@playwright/test";

test("superfícies ocultas não mantêm backdrop-filter ativo", async ({ page }) => {
  // Com consentimento já guardado, o banner de cookies nunca chega a ficar visível.
  await page.addInitScript(() => {
    localStorage.setItem(
      "metrion_cookie_consent",
      JSON.stringify({ necessary: true, analytics: false, date: new Date().toISOString() }),
    );
  });

  // Movimento reduzido remove o preloader de imediato, tornando a interação previsível.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0, { timeout: 15000 });

  // 1) Modal fechado: o backdrop não deve aplicar blur enquanto está oculto.
  const modal = page.locator("#quote-modal");
  await expect(modal).not.toHaveClass(/is-active/);

  const closedFilter = await page
    .locator("#quote-modal .modal__backdrop")
    .evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(closedFilter).toBe("none");

  // 2) Banner de cookies oculto: sem blur enquanto não é mostrado.
  const bannerFilter = await page
    .locator(".cookie-banner")
    .evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(bannerFilter).toBe("none");

  // 3) Ao abrir o modal, o efeito volta a aplicar-se.
  await page.getByRole("button", { name: /Pedir Orçamento/i }).first().click();
  await expect(modal).toHaveClass(/is-active/);

  const openFilter = await page
    .locator("#quote-modal .modal__backdrop")
    .evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(openFilter).toContain("blur");
});
