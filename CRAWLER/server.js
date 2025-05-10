const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const server = express();

server.get('/', async (req, res) => {
    const urlBase = 'https://xamacardoso.github.io/Buscardoso-ProgWeb/';
    const paginaInicial = `${urlBase}HTML/matrix.html`;

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
    
      // Recursivamente visitar os links encontrados
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
  
    const caminhoArquivo = path.join(__dirname, 'pagina.json');
    fs.writeFileSync(caminhoArquivo, JSON.stringify(resultados, null, 2), 'utf-8');
  
    res.json(resultados);
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});