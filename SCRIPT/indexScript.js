// Arquivo JavaScript para futuras funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar efeito de flicker na marquee para simular letreiro antigo
    const marquee = document.querySelector('.marquee');
    
    function randomFlicker() {
        // Chance aleatória de piscar
        if (Math.random() < 0.03) {
            marquee.style.opacity = Math.random() * 0.4 + 0.6;
            setTimeout(() => {
                marquee.style.opacity = 1;
            }, 100);
        }
        
        requestAnimationFrame(randomFlicker);
    }
    
    // Iniciar o efeito de flicker
    randomFlicker();
});