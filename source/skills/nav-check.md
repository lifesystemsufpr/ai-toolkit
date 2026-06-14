---
id: nav-check
title: Varredura de navegação no frontend
description: Use após um PR de frontend para procurar erros de navegação. Sobe o dev server, percorre as rotas principais com o navegador (Playwright/Chrome DevTools) e relata erros de console/rede e telas quebradas no formato de QA do time.
appliesTo: [frontend]
---

# Skill: Varredura de navegação no frontend

Após uma mudança de frontend (ou antes de uma demo), procure erros de navegação:

1. Suba o dev server do repo (`npm run dev`) e descubra a porta.
2. Liste as rotas principais (router do repo: react-router / Next app dir). Inclua pelo menos a
   home, login, e as telas de maior uso de cada produto.
3. Para cada rota, com Playwright/Chrome DevTools:
   - Navegue até ela e espere carregar.
   - Capture **erros de console** (error/warning) e **falhas de rede** (4xx/5xx).
   - Verifique que a tela renderiza conteúdo (não fica em branco / erro de boundary).
   - Tire um screenshot.
4. Exercite a navegação básica: clicar nos links principais do menu e voltar — sem erro de rota
   (404 inesperado, loop, tela branca).
5. Produza o relatório no **formato de QA do time** (o mesmo dos testes manuais no ClickUp):
   uma tabela cenário → resultado esperado → resultado obtido (✅/❌), com os screenshots e a lista
   de erros de console/rede por rota.

Não altere código de produto nesta skill — é verificação. Bugs viram itens de relatório/issue,
não fix silencioso.
