document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    const colorModeToggle = document.getElementById("colorModeToggle");
    const body = document.body;
    const introVisionSection = document.getElementById("introVision");

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        body.classList.remove("color-mode");
        updateIntroVisionBackground();
    });

    colorModeToggle.addEventListener("click", () => {
        body.classList.toggle("color-mode");
        body.classList.remove("dark-mode");
        updateIntroVisionBackground();
    });

    function updateIntroVisionBackground() {
        if (body.classList.contains("dark-mode")) {
            introVisionSection.style.background = "#121212";
        } else if (body.classList.contains("color-mode")) {
            introVisionSection.style.background = "#004d4d";
        } else {
            introVisionSection.style.background = "#000";
        }
    }

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

    // Chatbot Toggle
    const chatToggle = document.getElementById("chatToggle");
    const chatbox = document.getElementById("chatbox");
    const chatInput = document.getElementById("chatInput");
    const chatContent = document.getElementById("chatContent");

    chatToggle.addEventListener("click", () => {
        chatbox.style.display = chatbox.style.display === "block" ? "none" : "block";
    });

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const userMsg = chatInput.value;
            chatContent.innerHTML += `<p><strong>You:</strong> ${userMsg}</p>`;
            chatInput.value = "";
            setTimeout(() => {
                chatContent.innerHTML += `<p><strong>Bot:</strong> Aloha! I'll get back to you soon. 🌺</p>`;
            }, 1000);
        }
    });

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
    const closeBtn = document.getElementById("closeBtn");

    exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        heroSection.classList.add("hidden");
        introVisionSection.classList.add("visible");
    });

    closeBtn.addEventListener("click", () => {
        heroSection.classList.remove("hidden");
        introVisionSection.classList.remove("visible");
    });

    // Initial setup for intro-vision background based on current mode
    updateIntroVisionBackground();
});