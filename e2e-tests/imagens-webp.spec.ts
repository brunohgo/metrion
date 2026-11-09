import { test, expect } from "@playwright/test";

test("as imagens do site são servidas em WebP e carregam", async ({ page }) => {
  await page.goto("/");

  const hero = page.locator(".hero__bg-image");
  await expect(hero).toHaveAttribute("src", /\/images\/hero-laboratory\.webp$/);
  await expect(hero).toHaveAttribute("srcset", /hero-laboratory-960\.webp 960w/);

  // O navegador só reporta naturalWidth > 0 quando a imagem foi realmente descodificada.
  await expect
    .poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
});
