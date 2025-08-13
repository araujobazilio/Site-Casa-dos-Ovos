# HISTÓRICO DE MUDANÇAS — Casa dos Ovos

Data/Hora: 2025-08-13 16:09 (-03)

## Resumo das mudanças recentes

- Autenticação no Painel Admin com Supabase Auth (email/senha).
  - Login: "admin" mapeia para `admin@casadosovos.com`.
  - Logout disponível no cabeçalho do painel.
- Correção de tela branca ao abrir o painel admin.
  - Ajuste no escopo do `useEffect` de autenticação em `src/App.tsx`.
- Catálogo simplificado (5 produtos fixos) aplicado via painel:
  - OVO GRANDE — Ovos grandes, ideais para o dia a dia e receitas diversas.
  - OVO EXTRA BRANCO — Casca branca, categoria extra, excelente rendimento em preparos.
  - OVO EXTRA VERMELHO — Casca vermelha, categoria extra, sabor marcante e versátil.
  - OVO JUMBO — Ovos muito grandes, perfeitos para receitas especiais e maior rendimento.
  - OVO DE CODORNA — Pequenos e delicados, ótimos para saladas, aperitivos e pratos especiais.
  - Produtos antigos são desativados (is_active=false) e os 5 itens acima são inseridos/ativados.
- Remoção de preço do site público (cards de produto) e manutenção do botão de WhatsApp.
  - Texto do botão: "Consultar preço no WhatsApp".
  - Mensagem pré-preenchida sem valor de preço.
- Remoção de “Quantidade/dúzias” do card público e do formulário do admin.
- Integração de Google Maps na seção “Nossa Localização” com botão "Ver rota no Google Maps".
- Imagens: uso de `logotipo.jpg` e correção de referência do banner para `banner.png`.

## Arquivos principais afetados

- `src/App.tsx`
  - Login modal, sessão (`Session`), handlers de login/logout.
  - Gating do painel admin por sessão autenticada.
  - Botão e rotina "Aplicar Catálogo Simplificado".
  - Ajuste da exibição dos produtos (sem quantidade, sem preço público, CTA WhatsApp).
  - Correção do escopo do `useEffect` de auth para evitar tela branca.
- `src/lib/supabase.ts`
  - Cliente Supabase e tipos (`Product`, `StoreSettings`).
- `public/banner.png` e `public/logotipo.jpg`
  - Referências atualizadas no layout.

## Pendências/Próximos passos

- Verificar/ajustar salvamento de `store_settings` (store_name, address, whatsapp, etc.) após login.
- Garantir variáveis de ambiente no Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Testes finais (local e produção):
  - Login admin, salvar configurações, exibição do banner, mapa, e fluxo de WhatsApp nos cards.
- Subir repositório ao GitHub (se ainda não):
  - `git init`, `git remote add origin https://github.com/casadosovos/Site-Casa-dos-Ovos`, `git add .`, `git commit -m "feat: painel admin + catálogo simplificado + fix tela branca"`, `git push -u origin main`.

## Notas

- Projeto local: `c:/Users/arauj/Documents/CURSOS E PROJETOS/CASA DOS OVOS/Site-Casa-dos-Ovos`
- Repositório remoto: https://github.com/casadosovos/Site-Casa-dos-Ovos
- Segurança: RLS mantido, escrita permitida apenas para usuários autenticados.
- Preferências do site: remover preço em público, direcionar para WhatsApp.
