const fs = require('fs');
const { exec } = require('child_process');

const paginas = [];

function contagemLinksRecebidos() {
    // Inicializa a contagem de links recebidos
    for (const pagina of paginas) {
        pagina.linksRecebidos = 0;
    }

    // Conta quantas vezes cada página é apontada
    for (const pagina of paginas) {
        for (const link of pagina.info.linksPara) {
            const destino = paginas.find(p => p.nome === link);
            if (destino) {
                destino.linksRecebidos += 1;
            }
        }
    }
}

async function buscarPaginas() {
    try {
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

        const novasPaginas = JSON.parse(data);
        paginas.push(...novasPaginas);

        // Chama a contagem de links após carregar as páginas
        contagemLinksRecebidos();

    } catch (error) {
        console.error(`Erro durante a execução de buscarPaginas: ${error.message}`);
    }
}

function ranquearPaginas(termoBusca) {
    const resultados = [];
    console.log("Iniciando ranking...");

    for (const pagina of paginas) {
        const qtdTermo = (pagina.info.conteudo.match(new RegExp(termoBusca, 'gi')) || []).length;
        const pontosTermo = qtdTermo * 10;
        const pontosLinks = pagina.linksRecebidos * 10;
        const autorreferencia = pagina.info.linksPara.includes(pagina.nome) ? -15 : 0;

        const total = pontosTermo + pontosLinks + autorreferencia;

        const resultado = {
            pagina: pagina.nome,
            pontos: total,
            detalhes: {
                qtdTermo,
                pontosTermo,
                pontosLinks,
                autorreferencia
            }
        }
        
        resultados.push(resultado);
    }

    console.log("Ordenando resultados...");
    ordenarRanking(resultados);

    for (const resultado of resultados) {
        // console.log(resultado);
    }
}

function ordenarRanking(resultados) {
    resultados.sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.detalhes.pontosLinks !== a.detalhes.pontosLinks) {
            return b.detalhes.pontosLinks - a.detalhes.pontosLinks;
        }
        if (b.detalhes.qtdTermo !== a.detalhes.qtdTermo) {
            return b.detalhes.qtdTermo - a.detalhes.qtdTermo;
        }
        return a.detalhes.autorreferencia - b.detalhes.autorreferencia;
    });
}

async function main() {
    await buscarPaginas();
    ranquearPaginas("matrix");
}

main();
