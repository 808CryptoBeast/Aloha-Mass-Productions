document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
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
});
