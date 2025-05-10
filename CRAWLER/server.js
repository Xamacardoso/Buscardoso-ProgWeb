const puppeteer = require('puppeteer');
// const express = require('express');
const path = require('path');
const fs = require('fs');

(async () => {
  const urlBase = 'https://xamacardoso.github.io/Buscardoso-ProgWeb/';
  const paginaInicial = `${urlBase}HTML/matrix.html`;
  const caminhoArquivo = path.join(__dirname, 'pagina.json');

  // Limpa o arquivo antes de começar
  fs.writeFileSync(caminhoArquivo, '[]', 'utf-8');

  const visitadas = new Set();
  const resultados = [];

  const browser = await puppeteer.launch();

  async function visitarPagina(url) {
    if (visitadas.has(url)) return;
    visitadas.add(url);

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const dados = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.endsWith('.html'));

      const nomePagina = location.pathname.split('/').pop() || 'home.html';

      return {
        nome: nomePagina,
        info: {
          linksPara: links,
          conteudo: document.body.innerHTML
        }
      };
    });

    resultados.push({ url, ...dados });

    const linksAbsolutos = dados.info.linksPara.map(href =>
      new URL(href, url).href
    );

    for (const link of linksAbsolutos) {
      await visitarPagina(link);
    }

    await page.close();
  }

  await visitarPagina(paginaInicial);
  await browser.close();

  fs.writeFileSync(caminhoArquivo, JSON.stringify(resultados, null, 2), 'utf-8');

  console.log('Dados salvos em pagina.json');
})();