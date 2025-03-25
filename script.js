document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('exploreBtn');
    const closeBtn = document.getElementById('closeBtn');
    const introVision = document.getElementById('introVision');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const colorModeToggle = document.getElementById('colorModeToggle');

    // Explore Button to Show Intro Vision
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        introVision.classList.add('visible');
    });

    // Close Button to Hide Intro Vision
    closeBtn.addEventListener('click', () => {
        introVision.classList.remove('visible');
    });

    // Dark Mode Toggle (if added back later)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Color Mode Toggle (if added back later)
    if (colorModeToggle) {
        colorModeToggle.addEventListener('click', () => {
            console.log('Color mode toggled'); // Placeholder for future logic
        });
    }
});