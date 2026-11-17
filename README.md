Brasil Longevo
Tecnologia que aproxima o cuidado.
Sobre o projeto
O Brasil Longevo é um sistema web acadêmico desenvolvido para apoiar a organização do acompanhamento domiciliar de pacientes. A plataforma reúne informações de pacientes, cuidadores e equipes de saúde em um ambiente simples, acessível e responsivo, facilitando o acompanhamento de atendimentos e a comunicação por meio de ocorrências internas.

A versão 2.0 (simplificada) prioriza a facilidade de uso e de manutenção. O sistema oferece:
- Painel inicial: visão geral de pacientes, atendimentos e ocorrências.
- Pacientes: cadastro, consulta, edição, busca e arquivamento.
- Atendimentos: agendamento e acompanhamento de consultas e visitas.
- Ocorrências: registro e acompanhamento de solicitações internas.
- Relatórios: indicadores e exportação de dados em CSV.
- Perfis de acesso: coordenação, equipe de saúde, paciente e cuidador, com permissões específicas.
- Acessibilidade: interface responsiva, fonte ampliada e opção de alto contraste.
O projeto utiliza HTML, CSS e JavaScript no frontend, Node.js no backend e SQLite para armazenar os dados localmente. O módulo de medicamentos foi removido nesta versão.
Importante: esta é uma demonstração acadêmica com dados fictícios, não destinada ao uso clínico real. O registro de ocorrências não aciona ambulâncias ou serviços de emergência.

Guia de execução
1. Requisitos
- Node.js 22.13.0 ou superior.
- Um navegador atualizado.
- Um editor de código, como o Visual Studio Code (opcional).
2. Abrir o projeto
Baixe ou clone o repositório e abra no terminal a pasta que contém o arquivo package.json:
git clone https://github.com/GustavoSant1/BrasilLongevo.git
cd BrasilLongevo
Se o projeto foi baixado em ZIP, extraia o arquivo e abra diretamente a pasta extraída no terminal. Os comandos seguintes devem ser executados na pasta da versão 2.0 simplificada que contém o package.json.
3. Iniciar o sistema
Confira a versão do Node.js:
node --version
Inicie o servidor:
npm start
Acesse no navegador:

http://localhost:3000

Esta versão utiliza apenas recursos nativos do Node.js; não é necessário executar npm install.
4. Entrar na demonstração
Na tela de login, selecione um dos perfis de demonstração para preencher automaticamente as credenciais, ou utilize:
Perfil	E-mail	Senha
Coordenação	admin@brasil-longevo.local	Admin@1234
Equipe de saúde	enfermagem@brasil-longevo.local	Equipe@1234
Paciente	paciente@brasil-longevo.local	Paciente@1234
Cuidador	cuidador@brasil-longevo.local	Cuidador@1234


Essas contas são fictícias e servem apenas para testes locais.
5. Comandos úteis
npm run dev   # Inicia em modo de desenvolvimento e reinicia após alterações
npm test      # Executa os testes automatizados
Para encerrar o servidor, pressione Ctrl + C no terminal.
