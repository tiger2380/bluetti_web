(async () => {
    const darkMode = document.querySelector(".dark-mode");

    darkMode.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode-variables");
      darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
        darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
        
        window.eventEmitter.emit("theme", { theme: document.body.classList.contains("dark-mode-variables") ? "dark" : "light" });
    });
})();