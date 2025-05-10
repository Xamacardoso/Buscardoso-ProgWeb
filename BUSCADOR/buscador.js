const pagina = {
    "nome": "matrix.html",
    "info": {
      linksPara: ['blade_runner.html', 'interestellar.html', 'matrix.html', 'mochileiro.html'],
      linksRecebidos: 4,
      conteudo: '<html>...Matrix...Matrix...ficção científica...</html>',
    }
  }

function ranquearPaginas(termoBusca){
    const resultados = [];
    for (const pagina of paginas){
        // Quantidade de vezes que o termo aparece na pagina
        const qtdTermo = (pagina.info.conteudo.match(new RegExp(termoBusca, 'gi')) || []).length;
        
        const pontosTermo = qtdTermo * 10;
        const pontosLinks = pagina.info.linksRecebidos * 10;
        const autorreferencia = pagina.info.linksPara.includes(pagina.nome) ? -15 : 0;

        const total = pontosTermo + pontosLinks + autorreferencia;

        const resultado = {
            "pagina": pagina.nome,
            "pontos": total,
            "detalhes": {
                qtdTermo, pontosTermo, pontosLinks, autorreferencia
            }
        }

        resultados.push(resultado);
    }
}

function ordenarRanking(resultados){
    resultados.sort((a, b) => {
        // Ordenando normalmente por quantidade de termos
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;

        /** CRITÉRIOS DE DESEMPATE */
        // 1. Maior número de links recebidos
        if (b.detalhes.pontosLinks !== a.detalhes.pontosLinks){
            return b.detalhes.pontosLinks - a.detalhes.pontosLinks;
        }

        // 2. Maior quantidade de termos buscados no corpo do texto
        if (b.detalhes.qtdTermo !== a.detalhes.qtdTermo){
            return b.detalhes.qtdTermo - a.detalhes.qtdTermo;
        }

        // 3. Autorreferência
        return a.detalhes.autorreferencia - b.detalhes.autorreferencia
    });
}