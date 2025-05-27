// Efeitos específicos para a página de detalhes do filme

document.addEventListener('DOMContentLoaded', function() {
    const trailerPlaceholder = document.querySelector('.trailer-placeholder');
    if (trailerPlaceholder) {
        trailerPlaceholder.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const trailerFrame = document.querySelector('.trailer-frame');
            
            trailerFrame.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    title="Movie Trailer" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="position:absolute;top:0;left:0;width:100%;height:100%;"
                ></iframe>
            `;
        });
    }
    
    // Efeito de filme antigo - adiciona riscos e manchas aleatórias
    function addFilmScratch() {
        const movieInfo = document.querySelector('.movie-info');
        if (!movieInfo) return;
        
        const scratch = document.createElement('div');
        scratch.className = 'film-scratch';
        
        // Posição aleatória
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const width = Math.random() * 100 + 50;
        const opacity = Math.random() * 0.1;
        
        scratch.style.cssText = `
            position: absolute;
            top: ${top}%;
            left: ${left}%;
            width: ${width}px;
            height: 1px;
            background-color: white;
            opacity: ${opacity};
            pointer-events: none;
            z-index: 10;
        `;
        
        movieInfo.appendChild(scratch);
        
        // Remove o risco após um tempo aleatório
        setTimeout(() => {
            scratch.remove();
        }, Math.random() * 1000 + 300);
    }
    
    // Adiciona riscos periodicamente
    setInterval(addFilmScratch, 2000);
    
    // Efeito de cintilação para simular projetor antigo
    function flickerEffect() {
        const container = document.querySelector('.movie-detail-container');
        if (!container) return;
        
        // Chance aleatória de piscar
        if (Math.random() < 0.03) {
            container.style.opacity = Math.random() * 0.4 + 0.6;
            setTimeout(() => {
                container.style.opacity = 1;
            }, 100);
        }
    }
    
    // Executa o efeito de cintilação a cada 100ms
    setInterval(flickerEffect, 100);
});

(function() {
  // Obtém o canvas e seu contexto de desenho 2D
  const canvas = document.getElementById('warpBg');
  const ctx = canvas.getContext('2d');

  // Redimensiona o canvas à janela
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  // Executa ao redimensionar a janela
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  // Desenha o efeito de distorção
  function drawWarp() {
    // Incrementa o tempo (controla a velocidade)
    t += 0.01;  

    // Esmaece o quadro anterior
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Obtém o ponto central do canvas
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.hypot(cx, cy);

    // Círculos concêntricos que se expandem
    for (let i = 0; i < 80; i++) {
      // Calcula o progresso do círculo atual
      const progress = (i / 70 + t) % 1;
      const radius = progress * maxR;
      const alpha = 1.5 - progress;
      // Configura a cor e opacidade da linha
      ctx.strokeStyle = `rgba(255,102,0,${alpha * 0.25})`;
      ctx.lineWidth = 2;
      // Desenha o círculo
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Solicita a próxima frame
    requestAnimationFrame(drawWarp);
  }

  // Inicia o efeito de distorção
  drawWarp();
})();

