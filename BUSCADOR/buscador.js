const fs = require('fs');
const {exec} = require('child_process');

const paginas = [];

async function buscarPaginas() {
    try {
        // Aguarda a execução do script auxiliar
        await new Promise((resolve, reject) => {
            exec('node ../CRAWLER/server.js', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar o script auxiliar: ${error.message}`);
                    reject(error);
                    return;
                }

                if (stderr) {
                    console.error(`Erro no script auxiliar: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }

                resolve();
            });
        });

        // Aguarda a leitura do arquivo
        const data = await new Promise((resolve, reject) => {
            fs.readFile('../CRAWLER/pagina.json', 'utf-8', (err, data) => {
                if (err) {
                    console.error(`Erro ao ler o arquivo: ${err.message}`);
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });

        // Adiciona os dados ao array
        const novasPaginas = JSON.parse(data);
        paginas.push(...novasPaginas);
        // console.log('Páginas carregadas com sucesso:', novasPaginas);
    } catch (error) {
        console.error(`Erro durante a execução de buscarPaginas: ${error.message}`);
    }
}

function ranquearPaginas(termoBusca){
    const resultados = [];
    console.log("Iniciando ranking...");
    
    for (const pagina of paginas){
        // Quantidade de vezes que o termo aparece na pagina
        const qtdTermo = (pagina.info.conteudo.match(new RegExp(termoBusca, 'gi')) || []).length;
        
        const pontosTermo = qtdTermo * 5;
        const pontosLinks = pagina.info.linksPara * 10;
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

    console.log("Ordenando resultados...")
    ordenarRanking(resultados)
    for (const resultado of resultados) {
        console.log(resultado);
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

async function main () {
    await buscarPaginas();
    ranquearPaginas("matrix");
}

main();