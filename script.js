document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    const colorModeToggle = document.getElementById("colorModeToggle");

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.remove("color-mode");
    });

    colorModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("color-mode");
        document.body.classList.remove("dark-mode");
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
    const introVisionSection = document.getElementById("introVision");
    const closeBtn = document.getElementById("closeBtn");

    exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        heroSection.classList.add("hidden");
        introVisionSection.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        heroSection.classList.remove("hidden");
        introVisionSection.style.display = "none";
    });
});