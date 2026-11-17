# Revisão funcional — Brasil Longevo v2.0

## Decisões tomadas

| Área | Decisão | Resultado / verificação |
|---|---|---|
| Login/sessões | Mantido e isolado em `auth.js` | Login correto/incorreto, cookie, logout e escopo de usuário testados |
| Pacientes | Mantido e simplificado | Listar, buscar, filtrar, incluir, editar, visualizar ficha, arquivar testados via API |
| Unidades | Mantidas como cadastro demonstrativo de referência | Consulta permitida e vínculo validado no backend |
| Atendimentos | Mantidos | Agendamento, alteração de status, filtro e acesso por papel testados |
| Ocorrências | Mantidas como **registro interno** | Inclusão, mudança de status, retorno da equipe e restrições testados |
| Relatórios | Mantidos sem dados de medicamentos | Sumário, CSV e auditoria testados |
| Preferências de leitura | Mantidas | Fontes maiores/alto contraste e modelos de página renderizados |
| Medicamentos e estoque | **Removidos da aplicação** | Não existem tela, ações, endpoints, consultas nem novas tabelas |
| Prescrições e confirmações de doses | **Removidas** | Sem rotina automática em segundo plano |
| Alertas automáticos de medicação | **Removidos** | Não há disparos artificiais ou promessas de monitoramento |
| Emergência | Limitada a registro interno | Tela explica expressamente que não aciona serviços externos |
| Reset | Protegido com `--confirm` | Não apaga bancos apontados por `DB_PATH` customizado |

## Correções específicas de usabilidade

- **Novo paciente:** o botão no painel inicial carrega a lista de unidades antes de abrir o formulário.
- **Registrar ocorrência:** carrega pacientes permitidos antes de abrir o formulário, inclusive no painel inicial do cuidador/paciente.
- **Navegação:** evita que uma resposta antiga de rede substitua uma página mais recente.
- **Fichas:** busca um paciente por ID, sem percorrer toda a listagem no backend.
- **Agenda:** compromissos agendados recebem prioridade sobre os concluídos.
- **Relatórios:** barras nativas de progresso não dependem de estilo inline bloqueado pela política de segurança do servidor.
- **Dispositivos móveis:** tela sem largura excedente no viewport de 390 px nas prévias estáticas.

## Testes realizados

1. **Backend integrado:** autenticação, permissões, criação/edição/arquivamento de pacientes, atendimentos, ocorrências internas, CSV, indicadores, auditoria, origens não autorizadas e inexistência das rotas de medicamentos.
2. **Frontend estático:** verificação de sintaxe dos módulos JavaScript, renderização das seis áreas por perfil administrativo, proteção de texto HTML e inexistência de conteúdo do módulo removido.
3. **Revisão visual estática:** prévias de login, painel, pacientes, atendimentos, ocorrências e versão celular em `docs/previews/`.
4. **Windows:** banco de teste `:memory:` sem exclusão de pastas temporárias; a versão anterior passou no Windows do usuário e esta estratégia foi preservada. Os testes da versão 2 foram executados no ambiente de desenvolvimento, **não** diretamente no Windows do usuário.

## Teste manual recomendado após extrair

- Fazer login nos quatro perfis de demonstração.
- Abrir cada aba e confirmar que nenhuma referência a medicamentos aparece.
- Criar/editar um paciente fictício (equipe); arquivar com o perfil coordenação.
- Agendar e concluir atendimento fictício.
- Registrar ocorrência como paciente e atualizar como equipe.
- Exportar CSV no perfil coordenação e tentar acessar `/api/reports` sem login (deve negar).
- Conferir layout em celular, botões de acessibilidade e navegação por teclado.

## Itens intencionalmente fora do escopo

Gerenciamento de medicamentos, dosagens, prescrições, estoque, lembretes de doses, notificações externas, geolocalização, integração clínica ou emergência operacional. Uma eventual versão para dados reais exigiria revisão profissional de privacidade, segurança e conformidade.

## Compatibilidade testada com versão anterior

Foi realizado um teste de migração local de banco: uma base criada pelo backend v1.0.2 com oito pacientes foi aberta pela v2, preservando os oito registros e adicionando os campos necessários a ocorrências. O projeto não executa exclusão de tabelas legadas.
