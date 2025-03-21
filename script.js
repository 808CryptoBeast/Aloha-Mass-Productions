document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    const colorModeToggle = document.getElementById("colorModeToggle");
    const body = document.body;
    const amplifySection = document.getElementById("amplify");

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        body.classList.remove("color-mode");
    });

    colorModeToggle.addEventListener("click", () => {
        body.classList.toggle("color-mode");
        body.classList.remove("dark-mode");
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => observer.observe(img));

    // Reveal Features on Scroll
    const features = document.querySelectorAll(".feature");
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.5 });

    features.forEach(feature => revealObserver.observe(feature));

    // Smooth Scrolling for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Logo Dropdown Toggle
    const logo = document.getElementById("logo");
    const dropdown = document.getElementById("dropdown");

    logo.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Close Dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!logo.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });

    // Explore Button Functionality
    const exploreBtn = document.getElementById("exploreBtn");
    const heroSection = document.getElementById("hero");
    const introVisionSection = document.getElementById("introVision");
    const closeBtn = document.getElementById("closeBtn");

    exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        heroSection.classList.add("hidden");
        amplifySection.classList.add("hidden");
        introVisionSection.classList.add("visible");
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
    });

    closeBtn.addEventListener("click", () => {
        heroSection.classList.remove("hidden");
        amplifySection.classList.remove("hidden");
        introVisionSection.classList.remove("visible");
    });
});