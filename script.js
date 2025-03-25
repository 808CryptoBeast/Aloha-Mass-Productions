document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('exploreBtn');
    const closeBtn = document.getElementById('closeBtn');
    const introVision = document.getElementById('introVision');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const colorModeToggle = document.getElementById('colorModeToggle');

    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        introVision.classList.add('visible');
    });

    closeBtn.addEventListener('click', () => {
        introVision.classList.remove('visible');
    });

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    if (colorModeToggle) {
        colorModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('color-mode');
        });
    }
});