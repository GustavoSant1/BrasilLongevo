Brasil Longevo — versão 2.0 (simplificada)
Protótipo acadêmico com dados fictícios. Não utilizar com pacientes reais, não publicar na internet com as credenciais de demonstração e não utilizar como canal de emergência.

Recriação do Brasil Longevo, a partir da documentação e dos protótipos fornecidos no projeto universitário, com foco em acompanhamento domiciliar, atendimento e comunicação entre equipe, pacientes e cuidadores. A versão 2 foi simplificada conforme a nova definição de escopo: sem módulo de medicamentos.
Executar no Windows / VS Code
Requisito: Node.js 22.13 ou superior (a API node:sqlite ainda pode apresentar aviso de recurso experimental em versões Node 22).
1. Extraia o ZIP para uma pasta sua (ex.: C:\Projetos\Brasil-Longevo-Simplificado).
2. Abra essa pasta no VS Code.
3. No PowerShell, execute:
node --version
npm start
4. Abra http://localhost:3000 no navegador.
Não precisa executar npm install: o código usa somente módulos nativos do Node.js e HTML/CSS/JS puros. Para usar outra porta, no PowerShell: $env:PORT=3001; npm start.
Perfis de demonstração
A tela de login oferece botões para preencher automaticamente os dados fictícios de cada perfil:
Perfil	E-mail	Senha de demonstração
Coordenação	admin@brasil-longevo.local	Admin@1234
Equipe de saúde	enfermagem@brasil-longevo.local	Equipe@1234
Paciente	paciente@brasil-longevo.local	Paciente@1234
Cuidador	cuidador@brasil-longevo.local	Cuidador@1234


Os dados são fictícios. Os acessos de paciente e cuidador veem apenas seus registros vinculados; a equipe gerencia pacientes e atendimentos; a coordenação também pode arquivar cadastros e consultar auditoria.
Funcionalidades
Módulo	O que permite	Quem pode alterar
Painel	Indicadores, agenda e ocorrências	Somente leitura
Pacientes	Buscar, filtrar, cadastrar, editar, abrir ficha, arquivar sem apagar	Equipe; arquivar somente coordenação
Atendimentos	Consultas e visitas domiciliares com data, status e responsável	Equipe
Ocorrências internas	Registrar e acompanhar solicitações e o retorno da equipe	Todos registram; equipe atualiza
Relatórios	Indicadores e exportação CSV	Equipe
Configurações	Texto ampliado, contraste e informações da instalação	Todos; auditoria só coordenação


IMPORTANTE: o módulo de medicamentos foi removido da navegação, formulários, API ativa e fluxos de prescrição/dose/alerta automático. Ocorrências são registros internos, não notificações externas ou pedidos reais de ambulância. Em uma emergência real no Brasil, ligue 192 (SAMU).
Testes
npm test
A suíte usa SQLite em memória, sem criar pastas temporárias. Isso elimina o problema anterior do Windows/OneDrive (EPERM ao excluir banco de testes). Os testes verificam autenticação, isolamento por perfil, criação e edição, arquivamento, consultas, ocorrências, relatórios, auditoria, erros de validação, rotas removidas, sintaxe dos módulos ES e renderização das seis telas.
Organização do código
Brasil-Longevo-Simplificado/
├── package.json                   # scripts npm
├── server/
│   ├── index.js                   # servidor HTTP e roteamento
│   ├── db.js                      # SQLite, esquema, migrações e dados fictícios
│   ├── auth.js                    # login, senha, sessão
│   ├── common.js                  # validações, permissões, auditoria
│   ├── routes/
│   │   ├── patients.js            # pacientes
│   │   ├── appointments.js        # atendimentos
│   │   ├── occurrences.js         # ocorrências internas
│   │   └── reports.js             # relatórios / exportação
│   └── reset.js                   # redefinição manual do banco demo
├── public/
│   ├── index.html                 # estrutura básica
│   ├── styles.css                 # identidade visual, responsividade
│   ├── favicon.svg
│   └── js/
│       ├── app.js                 # navegação e eventos
│       ├── api.js                 # cliente HTTP único
│       ├── utils.js               # formatação e ícones
│       ├── ui.js                  # componentes visuais compartilhados
│       ├── views.js               # shell, login e registro de páginas
│       ├── forms.js               # formulários modais
│       └── pages/                 # uma tela por arquivo
│           ├── dashboard.js
│           ├── patients.js
│           ├── appointments.js
│           ├── occurrences.js
│           ├── reports.js
│           └── settings.js
├── tests/
│   ├── api.test.js                # testes de API e permissões
│   └── frontend.test.js           # testes de módulos e telas
├── docs/
│   ├── ARQUITETURA.md             # responsabilidades e fluxos
│   ├── REVISAO.md                 # revisão por funcionalidade
│   └── previews/                  # prévias estáticas: desktop e celular
└── data/                          # criado automaticamente; ignorado pelo Git
Onde modificar sem complicação
- Quer alterar o visual? public/styles.css, começando nas variáveis :root.
- Quer alterar o conteúdo de uma tela? public/js/pages/NOME.js.
- Quer alterar um formulário? public/js/forms.js.
- Quer incluir uma regra de paciente? server/routes/patients.js.
- Quer configurar o login? server/auth.js.
- Quer alterar campos do banco? server/db.js, adicionando uma migração.
Evite regras de banco diretamente no frontend. O navegador sempre conversa com o backend pela API /api/.
Persistência e atualização v1 → v2
- Banco padrão: data/brasil-longevo.sqlite. Ele é criado automaticamente na primeira execução.
- A versão 2 instala um banco novo sem tabelas de medicamentos.
- Se você reutilizar o banco .sqlite da versão anterior, a versão 2 reconhece os campos existentes e acrescenta somente os campos necessários para ocorrências. As tabelas antigas de medicamentos podem continuar fisicamente lá, mas não são consultadas, alteradas ou expostas pela nova API.
- Não sobrescreva seu banco antigo sem fazer backup. Para preservar os demais registros, copie seu banco somente depois de encerrar o servidor e de guardar um backup dos arquivos .sqlite, -wal e -shm quando existirem.
- Para testar a versão 2 com dados zerados, deixe a pasta data/ vazia; serão criados novos dados fictícios.
- O comando npm run reset:demo -- --confirm apaga deliberadamente o banco padrão de demonstração. É bloqueado se DB_PATH apontar para outro arquivo. Não execute se tiver dados que deseja preservar.
Segurança e limitações
Este projeto é destinado exclusivamente a trabalhos de faculdade. Inclui hash scrypt de senhas, cookies de sessão HttpOnly/`SameSite`, validação de origem, consultas SQL parametrizadas e controle básico de acesso por perfil. Essas medidas não constituem certificação de segurança ou de conformidade com a LGPD.

Antes de uso real seriam necessários, entre outros: revisão de segurança externa, HTTPS e implantação adequada, recuperação segura de conta, gestão de senhas, consentimento e base legal para dados de saúde, isolamento por unidade, trilhas de auditoria e retenção, política de backups, testes de acessibilidade assistiva e integração oficialmente autorizada com serviços de saúde. O protótipo bloqueia lançamento em NODE_ENV=production salvo uma liberação explícita não recomendada para uso real.
Documentação complementar
- [Arquitetura e mapa de módulos](docs/ARQUITETURA.md)
- [Revisão funcional e testes](docs/REVISAO.md)
Brasil Longevo — tecnologia que aproxima o cuidado.
