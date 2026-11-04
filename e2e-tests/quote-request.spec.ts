import { test, expect } from "@playwright/test";

test("submits a technical quote request", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("banner").getByRole("button", { name: "Solicitar Orçamento" }).click();

  const dialog = page.getByRole("dialog", { name: "Solicitar Orçamento Técnico" });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel("Nome Completo *").fill("Eng. Rui Silva");
  await dialog.getByLabel("Empresa / Organização *").fill("Indústrias Lda.");
  await dialog.getByLabel("Email Corporativo *").fill("rui.silva@empresa.pt");
  await dialog.getByLabel("Serviço Pretendido *").selectOption("calibracao");
  await dialog.getByLabel("Tipo / Modelo do Equipamento *").fill("Manómetro digital 0-100 bar");
  await dialog.getByLabel("Autorizo o tratamento dos dados recolhidos para efeitos de elaboração e resposta à proposta comercial, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD). *").check();
  await dialog.getByRole("button", { name: "Submeter Pedido de Orçamento" }).click();

  await expect(dialog.getByText("Pedido Submetido com Sucesso")).toBeVisible();
  await expect(page.getByText("Pedido de cotação submetido com sucesso. Responderemos em 24h úteis.")).toBeVisible();
});
