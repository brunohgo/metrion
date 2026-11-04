import { test, expect } from "@playwright/test";

test("homepage loads within the expected performance budget", async ({ page }) => {
  const startedAt = Date.now();

  await page.goto("/", { waitUntil: "load" });
  await expect(page.getByRole("heading", { name: "PRECISÃO QUE TRANSFORMA RESULTADOS." })).toBeVisible();

  const timing = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      load: navigation.loadEventEnd - navigation.startTime,
    };
  });

  const elapsed = Date.now() - startedAt;
  expect(timing.domContentLoaded).toBeLessThan(3000);
  expect(timing.load).toBeLessThan(5000);
  expect(elapsed).toBeLessThan(7000);
});
