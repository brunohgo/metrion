import { test, expect } from "@playwright/test";

test("preloader counts from 0 to 100 coherently and unveils the page", async ({ page }) => {
  // Samples every value the readout shows, so the test can check that the
  // counter never jumps backwards and ends exactly at 100.
  await page.addInitScript(() => {
    const samples: number[] = [];
    (window as any).__preloaderSamples = samples;

    document.addEventListener("DOMContentLoaded", () => {
      const readout = document.querySelector(".preloader__value");
      if (!readout) return;

      const record = () => {
        const value = parseInt((readout.textContent || "").trim(), 10);
        if (!Number.isNaN(value)) samples.push(value);
      };

      record();
      new MutationObserver(record).observe(readout, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
  });

  await page.goto("/");

  await expect(page.getByRole("progressbar", { name: "A carregar a página" })).toBeAttached();
  await expect(page.locator(".preloader")).toBeHidden({ timeout: 15000 });

  const samples = await page.evaluate(() => (window as any).__preloaderSamples as number[]);

  expect(samples.length).toBeGreaterThan(8);
  expect(samples[0]).toBeLessThanOrEqual(15);

  for (let index = 1; index < samples.length; index += 1) {
    expect(samples[index]).toBeGreaterThanOrEqual(samples[index - 1]);
    expect(samples[index]).toBeLessThanOrEqual(100);
  }

  expect(samples[samples.length - 1]).toBe(100);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
});