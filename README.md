# Buscardoso-ProgWeb

Repositório do exercício de **Programação para a Internet** (ADS – IFPI) sobre _crawler_ e _buscador_ de páginas de ficção científica.

🏠 [**Site publicado no GitHub Pages**](https://xamacardoso.github.io/Buscardoso-ProgWeb/)

## 📖 Sobre o Projeto

Este projeto consiste em:

1. **Hospedar** cinco páginas HTML interligadas (Blade Runner, Duna, Matrix, Interestellar e Mochileiro).
2. **Implementar** um _crawler_ que:
   - Recebe uma URL inicial.
   - Baixa a página e extrai seu conteúdo e links.
   - Repete o processo para cada link até visitar todas as páginas, sem repetir visitas.
3. **Desenvolver** um _buscador_ que, a partir das páginas já baixadas:
   - Calcula pontuação de cada página segundo:
     - **Autoridade** (links recebidos × +10 pts);
     - **Frequência** do termo buscado no código-fonte (× +10 pts);
     - **Penalização** por auto-referência (–15 pts);
   - Ordena resultados e aplica critérios de desempate:
     1. Maior número de links recebidos;
     2. Maior ocorrência do termo;
     3. Menor auto-referência.
4. **Exibir** resultados de forma amigável, com opção de ver a tabela de pontuação.

---

## 📂 Estrutura de pastas

```terminal
.
├── ASSET/                 → arquivos estáticos (imagens, fontes etc.)
├── CSS/                   → estilos gerais do site
├── HTML/                  → páginas de ficção científica (.html)
├── BUSCADOR/              → código-fonte do buscador (front-end / scripts)
├── CRAWLER/               → implementação do crawler em JavaScript
├── SCRIPT/                → scripts auxiliares (build, deploy etc.)
├── .jekyllignore          → arquivos e pastas ignorados pelo GitHub Pages
├── index.html             → página inicial / índice
└── server.js              → servidor local (Node.js + Express)
````

## ⚙️ Tecnologias

- **Node.js**  
- **Express** (framework web)  
- **Puppeteer** (navegação headless e extração de conteúdo)  
- **Nodemon** (devDependency para reload automático em desenvolvimento)  
- **HTML**, **CSS** e **JavaScript** puros  
- **GitHub Pages** (publicação das páginas estáticas)

## 🕵️‍♂️ Como usar o buscador

1. No campo de busca, digite um termo (ex.: `Matrix`, `universo`, `viagem`).
2. Clique em **Buscar**.
3. Será exibida:

   - Lista de páginas ordenadas pela pontuação;
   - Detalhes de autoridade, frequência e penalização;
   - Critérios de desempate aplicados.

---

## 🧪 Casos de teste

| Caso | Termo               | Páginas que deveriam aparecer                   |
| :--: | ------------------- | ----------------------------------------------- |
|   1  | `Matrix`            | Blade Runner, Interestellar, Matrix, Mochileiro |
|   2  | `ficção científica` | Blade Runner, Matrix, Mochileiro, Interestellar |
|   3  | `realidade`         | Blade Runner, Matrix, Interestellar             |
|   4  | `universo`          | Duna, Mochileiro                                |
|   5  | `viagem`            | Mochileiro, Interestellar                       |

---

## 📚 Referências

- [Como funcionam os mecanismos de busca – Moz](https://moz.com/beginners-guide-to-seo/how-search-engines-operate)
- [Axios Docs](https://axios-http.com/docs/intro)
- [Cheerio Docs](https://cheerio.js.org/)

## 👨‍💻 Desenvolvedores

- [**Arthur Vieira**](https://github.com/ArthurV10)
- [**Iglesio Junior**](https://github.com/Iglesiojunior)
- [**Nícolas Rafael**](https://github.com/NicolasRaf)
- [**Xamã Cardoso**](https://github.com/Xamacardoso)
