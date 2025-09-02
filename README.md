📌 Painel PIX
Sistema web desenvolvido em React para gerenciamento de pagamentos via PIX e pedidos, com funcionalidades para múltiplos pagamentos, consulta de pedidos de entrega e retirada, e detalhamento via modais.

🚀 Tecnologias utilizadas
React 19 – Biblioteca principal

React Router DOM – Navegação entre páginas

Bootstrap 5 – Layout e responsividade

Bootstrap Icons – Ícones vetoriais

Create React App – Estrutura base do projeto

📂 Estrutura de pastas

src/
 ├── components/         # Componentes reutilizáveis (botões, tabelas, etc.)
 ├── pages/              # Páginas principais da aplicação
 ├── widgets/            # Modais e componentes auxiliares
 ├── index.js            # Ponto de entrada do React
 ├── App.js              # Estrutura principal da aplicação
📥 Instalação
Clone este repositório:


git clone https://seu-repositorio.git
Acesse a pasta do projeto:

cd painel-pix
Instale as dependências:


npm install
📌 Se necessário, instale Bootstrap e Bootstrap Icons manualmente:

bash
Copiar
Editar
npm install bootstrap bootstrap-icons
E importe no src/index.js:

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
📦 Dependências do projeto
react – Base do projeto

react-dom – Renderização do React

react-router-dom – Rotas e navegação

react-scripts – Scripts do Create React App

@testing-library/react, @testing-library/dom, @testing-library/user-event – Testes

@testing-library/jest-dom – Extensões para Jest

web-vitals – Métricas de performance

bootstrap – Layout responsivo

bootstrap-icons – Ícones vetoriais

▶️ Executando o projeto
Para rodar em ambiente de desenvolvimento:

r
npm start
O projeto estará disponível em:
http://localhost:3000
