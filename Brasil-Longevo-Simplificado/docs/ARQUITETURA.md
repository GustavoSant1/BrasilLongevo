# Arquitetura simples — Brasil Longevo v2

## Objetivos

1. **Manutenção direta:** cada regra de negócio em `server/routes` e cada tela em `public/js/pages`.
2. **Menos dependências:** backend HTTP nativo do Node.js, banco SQLite nativo, frontend sem build.
3. **Agilidade:** carregar dados sob demanda por tela, usar índices nas consultas, não depender de serviços externos na demonstração.
4. **Acesso controlado:** servidor valida quem pode ler ou alterar dados, independentemente do menu mostrado.

## Fluxo

```text
Navegador (HTML/CSS + JS modular)
   |
   | GET /api/dashboard, /api/patients, /api/appointments ...
   | POST/PUT/PATCH/DELETE para alterações
   v
Node HTTP (server/index.js)
   |---- auth.js -> sessão por cookie
   |---- common.js -> validação, perfis, auditoria
   |---- routes/patients.js
   |---- routes/appointments.js
   |---- routes/occurrences.js
   |---- routes/reports.js
   v
SQLite (server/db.js)
```

## Camadas e responsabilidades

- **`server/index.js`**: receber a requisição, tratar JSON, entregar arquivos estáticos e direcionar à rota. Sem SQL de negócio.
- **`server/db.js`**: criar tabelas, preparar o SQLite, migrar campos antigos e incluir dados fictícios em instalação nova. Não contém HTML.
- **`server/auth.js`**: verificar senha, gerenciar sessão e limitar tentativas de login.
- **`server/common.js`**: garantir permissões e validar tipos/formatos, além de registrar auditoria.
- **`server/routes/*`**: dados e regras de um domínio; nenhuma rota conhece HTML.
- **`public/js/api.js`**: ponto único de chamadas HTTP, evitando `fetch()` espalhado por telas.
- **`public/js/app.js`**: carregar só os dados da página aberta, controlar navegação, formulários, erros e preferências.
- **`public/js/ui.js` e `public/js/utils.js`**: elementos comuns; evita repetição visual.
- **`public/js/pages/*`**: HTML de apresentação de cada área, em arquivos independentes.

## Rotas disponíveis

| Método | Rota | Objetivo |
|---|---|---|
| GET | `/api/health` | Verificar processo ativo (não é indicador clínico) |
| POST | `/api/auth/login` | Autenticar usuário demo |
| GET | `/api/auth/me` | Consultar sessão |
| POST | `/api/auth/logout` | Encerrar sessão |
| GET | `/api/dashboard` | Resumo do usuário |
| GET | `/api/units` | Unidades de demonstração |
| GET / POST | `/api/patients` | Consultar/criar pacientes |
| GET / PUT / DELETE | `/api/patients/:id` | Ficha, edição ou arquivamento |
| GET / POST | `/api/appointments` | Listar/agendar atendimentos |
| PUT | `/api/appointments/:id` | Atualizar atendimento |
| GET / POST | `/api/occurrences` | Consultar/registrar ocorrência interna |
| PATCH | `/api/occurrences/:id` | Atualizar ocorrência (equipe) |
| GET | `/api/reports` | Indicadores (equipe) |
| GET | `/api/reports/patients.csv` | Exportar CSV (equipe) |
| GET | `/api/audit` | Últimas ações (coordenação) |

**Não há** rotas ativas para medicamentos, estoques, prescrições, doses ou acionamento real de ambulâncias.

## Dados e migração

Tabelas usadas: `units`, `patients`, `users`, `caregiver_links`, `appointments`, `emergency_requests`, `sessions` e `audit`. A tabela histórica `emergency_requests` foi preservada para compatibilidade; na versão atual ela representa **ocorrências internas**, não uma solicitação enviada a serviço externo. A migração adiciona `severity`, `resolution`, `resolved_by`, `resolved_at` quando necessário.

A desativação do módulo de medicamentos **não executa `DROP TABLE`**. Essa decisão protege quem utiliza um SQLite da versão anterior e permite migração controlada em outra etapa.

## Usabilidade e desempenho

- UI responsiva sem bibliotecas pesadas; classes comuns no CSS.
- Busca e filtro na tela para listas pequenas, com entrada estabilizada de 140 ms.
- Carregamento sob demanda: não buscar todas as tabelas a cada mudança de tela.
- Abas bloqueadas de acordo com o perfil; o servidor repete as validações.
- Botões e feedback de carregamento, erros e salvamento.
- Alterações de fonte e contraste persistidas apenas nas preferências locais do navegador.
- Diminuição de disputas de navegação: respostas de páginas anteriores não substituem a tela atual.

## Limites do protótipo

A suíte automatizada cobre fluxos de API e composição das telas, mas não substitui testes manuais em navegadores reais, leitores de tela e dispositivos de idosos. Esta instalação **não** possui integração de SMS, WhatsApp, UBS, SAMU, hospital ou autenticação governamental. Não existem garantias de prazo, disponibilidade operacional ou atendimento.
