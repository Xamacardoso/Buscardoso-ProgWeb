document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const searchInput = document.getElementById("search-input")
  // Corrigindo o seletor do botão - agora usando querySelectorAll para pegar todos os botões com a classe search-button
  const searchButtons = document.querySelectorAll(".search-button")
  const searchResults = document.getElementById("search-results")

  // Função para carregar os dados do JSON gerado pelo crawler
  async function carregarDados() {
    try {
      // Verificar se estamos na página index ou em uma página de filme
      const isMoviePage = window.location.pathname.includes("/HTML/")
      
      // Ajustar o caminho do JSON com base na localização atual
      const jsonPath = isMoviePage ? "../CRAWLER/pagina.json" : "./CRAWLER/pagina.json"
      
      console.log("Tentando carregar JSON de:", jsonPath)
      
      const response = await fetch(jsonPath)
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados (status: ${response.status})`)
      }
      return await response.json()
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      
      // Tentar caminho alternativo se o primeiro falhar
      try {
        const altPath = window.location.pathname.includes("/HTML/") 
          ? "../../CRAWLER/pagina.json" 
          : "../CRAWLER/pagina.json"
        
        console.log("Tentando caminho alternativo:", altPath)
        
        const altResponse = await fetch(altPath)
        if (!altResponse.ok) {
          throw new Error(`Erro no caminho alternativo (status: ${altResponse.status})`)
        }
        return await altResponse.json()
      } catch (altError) {
        console.error("Erro no caminho alternativo:", altError)
        return []
      }
    }
  }

  // Função para calcular a quantidade de links recebidos para cada página
  function calcularLinksRecebidos(paginas) {
    // Criar um mapa de contagem de links
    const contagem = {}

    // Inicializar contagem para cada página
    paginas.forEach((pagina) => {
      contagem[pagina.nome] = 0
    })

    // Contar links recebidos
    paginas.forEach((pagina) => {
      pagina.info.linksPara.forEach((link) => {
        // Extrair o nome do arquivo do link
        const nomeArquivo = link.split("/").pop()
        if (contagem[nomeArquivo] !== undefined) {
          contagem[nomeArquivo]++
        }
      })
    })

    return contagem
  }

  // Função para ranquear páginas (usando a lógica do buscador.js)
  function ranquearPaginas(paginas, termoBusca, linksRecebidos) {
    const resultados = []

    for (const pagina of paginas) {
      // Quantidade de vezes que o termo aparece na página
      const qtdTermo = (pagina.info.conteudo.match(new RegExp(termoBusca, "gi")) || []).length

      const pontosTermo = qtdTermo * 10
      const pontosLinks = linksRecebidos[pagina.nome] * 10

      // Verificar se a página tem link para si mesma
      const autorreferencia = pagina.info.linksPara.some((link) => link.includes(pagina.nome)) ? -15 : 0

      const total = pontosTermo + pontosLinks + autorreferencia

      // Só incluir nos resultados se houver pelo menos uma ocorrência do termo ou se a busca estiver vazia
      if (qtdTermo > 0 || termoBusca.trim() === "") {
        const resultado = {
          pagina: pagina,
          pontos: total,
          detalhes: {
            qtdTermo,
            pontosTermo,
            pontosLinks,
            autorreferencia,
          },
        }

        resultados.push(resultado)
      }
    }

    return resultados
  }

  // Função para ordenar o ranking (usando a lógica do buscador.js)
  function ordenarRanking(resultados) {
    resultados.sort((a, b) => {
      // Ordenando normalmente por pontuação total
      if (b.pontos !== a.pontos) return b.pontos - a.pontos

      // CRITÉRIOS DE DESEMPATE
      // 1. Maior número de links recebidos
      if (b.detalhes.pontosLinks !== a.detalhes.pontosLinks) {
        return b.detalhes.pontosLinks - a.detalhes.pontosLinks
      }

      // 2. Maior quantidade de termos buscados no corpo do texto
      if (b.detalhes.qtdTermo !== a.detalhes.qtdTermo) {
        return b.detalhes.qtdTermo - a.detalhes.qtdTermo
      }

      // 3. Autorreferência
      return a.detalhes.autorreferencia - b.detalhes.autorreferencia
    })

    return resultados
  }

  // Função para obter a URL da imagem do poster com base no nome do arquivo
  function getPosterUrl(nomeArquivo) {
    if (nomeArquivo.includes("matrix")) {
      return "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
    } else if (nomeArquivo.includes("interestelar")) {
      return "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
    } else if (nomeArquivo.includes("mochileiro")) {
      return "https://m.media-amazon.com/images/M/MV5BZmU5MGU4MjctNjA2OC00N2FhLWFhNWQtMzQyMGI2ZmQ0Y2YyL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
    } else if (nomeArquivo.includes("blade_runner")) {
      return "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
    } else if (nomeArquivo.includes("duna")) {
      return "https://www.dvd-premiery.cz/data/imgauto/6/0/204204_01.jpg"
    }
    return ""
  }

  // Função para obter o título formatado com base no nome do arquivo
  function getTitulo(nomeArquivo) {
    if (nomeArquivo.includes("matrix")) {
      return "MATRIX"
    } else if (nomeArquivo.includes("interestelar")) {
      return "INTERESTELAR"
    } else if (nomeArquivo.includes("mochileiro")) {
      return "O GUIA DO MOCHILEIRO DAS GALÁXIAS"
    } else if (nomeArquivo.includes("blade_runner")) {
      return "BLADE RUNNER"
    } else if (nomeArquivo.includes("duna")) {
      return "DUNA: PARTE 1"
    } else if (nomeArquivo.includes("index")) {
      return "PÁGINA INICIAL"
    }
    return nomeArquivo.replace(".html", "").toUpperCase()
  }

  // Função para ajustar URLs relativas com base na página atual
  function ajustarURL(url) {
    // Verificar se estamos na página index ou em uma página de filme
    const isMoviePage = window.location.pathname.includes("/HTML/")
    
    // Se for uma URL relativa e estivermos em uma página de filme, ajustar o caminho
    if (url.startsWith("./HTML/") && isMoviePage) { 
      return url.replace("./HTML/", "./")
    }
    
    return url
  }

  // Função para exibir os resultados da busca
function exibirResultados(resultados) {
  searchResults.innerHTML = ""

  if (resultados.length === 0) {
    searchResults.innerHTML = '<div class="no-results">Nenhum resultado encontrado. Tente outra busca.</div>'
    searchResults.classList.add("active")
    return
  }

  // ─── 1) Botão que abre o modal da tabela ─────────────────────────────────
  const btnTabela = document.createElement("button")
  btnTabela.id = "btn-tabela-modal"
  btnTabela.textContent = "Visualizar Tabela"
  btnTabela.className = "btn-tabela"
  searchResults.appendChild(btnTabela)

  // ─── 2) Cria o modal (inicialmente oculto) ────────────────────────────────
  const modal = document.createElement("div")
  modal.id = "modal-tabela"
  modal.className = "modal-backdrop hidden"
  modal.innerHTML = `
    <div class="modal-content">
      <button id="close-modal" class="close-modal">&times;</button>
      <h2>Ranking de Páginas</h2>
      <div class="table-wrapper">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Página</th>
              <th>Ocorrências (+10)</th>
              <th>Links Recebidos (+10)</th>
              <th>Autorreferência (−15)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${resultados
              .filter(r => r.pagina.nome !== "index.html")
              .map((r, idx) => {
                const p = r.pagina.nome
                const d = r.detalhes
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${p}</td>
                    <td>${d.qtdTermo}×10 = ${d.pontosTermo}</td>
                    <td>${d.pontosLinks/10}×10 = ${d.pontosLinks}</td>
                    <td>${d.autorreferencia || 0}</td>
                    <td>${r.pontos}</td>
                  </tr>
                `
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  // ─── 3) Eventos de abrir/fechar modal ────────────────────────────────────
  btnTabela.addEventListener("click", () => {
    modal.classList.remove("hidden")
  })
  modal.querySelector("#close-modal").addEventListener("click", () => {
    modal.classList.add("hidden")
  })

  // ─── 4) Renderiza os cards de poster normalmente ─────────────────────────
  resultados.forEach((resultado) => {
    const pagina = resultado.pagina
    const detalhes = resultado.detalhes
    const titulo = getTitulo(pagina.nome)
    const posterUrl = getPosterUrl(pagina.nome)

    if (pagina.nome === "index.html") return

    const resultItem = document.createElement("div")
    resultItem.className = "result-item"

    // escolha de classe de link omitida por brevidade...
    const movieUrl    = pagina.url || "./HTML/" + pagina.nome
    const adjustedUrl = ajustarURL(movieUrl)

    resultItem.innerHTML = `
      <img src="${posterUrl}" alt="${titulo}" class="result-poster">
      <div class="result-info">
        <div class="result-title">${titulo}</div>
        <div class="result-details">
          <span class="result-score">Relevância: ${resultado.pontos}</span>
          <span>Ocorrências: ${detalhes.qtdTermo}</span>
          <span>Links recebidos: ${detalhes.pontosLinks / 10}</span>
        </div>
        <a href="${adjustedUrl}" class="result-link">VER FILME</a>
      </div>
    `
    searchResults.appendChild(resultItem)
  })

  searchResults.classList.add("active")
}

  // Função para realizar a busca
  async function realizarBusca() {
    const termoBusca = searchInput.value.trim()

    if (termoBusca === "" && searchResults.classList.contains("active")) {
      searchResults.classList.remove("active")
      return
    }

    // Mostrar mensagem de carregamento
    searchResults.innerHTML = '<div class="no-results">Carregando resultados...</div>'
    searchResults.classList.add("active")

    try {
      // Carregar dados do JSON gerado pelo crawler
      const paginas = await carregarDados()

      if (paginas.length === 0) {
        searchResults.innerHTML =
          '<div class="no-results">Não foi possível carregar os dados. Verifique se o crawler foi executado.</div>'
        return
      }

      // Calcular links recebidos para cada página
      const linksRecebidos = calcularLinksRecebidos(paginas)

      // Ranquear e ordenar as páginas
      const resultados = ranquearPaginas(paginas, termoBusca, linksRecebidos)
      const resultadosOrdenados = ordenarRanking(resultados)

      // Exibir os resultados
      exibirResultados(resultadosOrdenados)
    } catch (error) {
      console.error("Erro ao realizar busca:", error)
      searchResults.innerHTML = '<div class="no-results">Erro ao buscar resultados. Tente novamente.</div>'
    }
  }

  // Verificar se os elementos necessários existem na página
  if (searchInput && searchButtons.length > 0 && searchResults) {
    console.log("Elementos do buscador encontrados, adicionando event listeners")
    
    // Event listeners - agora adicionando para todos os botões
    searchButtons.forEach((button) => {
      button.addEventListener("click", realizarBusca)
      console.log("Listener adicionado ao botão:", button)
    })

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        realizarBusca()
      }
    })

    // Fechar resultados ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        !searchResults.contains(e.target) &&
        e.target !== searchInput &&
        !Array.from(searchButtons).includes(e.target) &&
        searchResults.classList.contains("active")
      ) {
        searchResults.classList.remove("active")
      }
    })
  } else {
    console.error("Elementos do buscador não encontrados na página")
    if (!searchInput) console.error("Input de busca não encontrado")
    if (searchButtons.length === 0) console.error("Botões de busca não encontrados")
    if (!searchResults) console.error("Div de resultados não encontrada")
  }
})

