(async () => {
    const darkMode = document.querySelector(".dark-mode");

    darkMode.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode-variables");
      darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
        darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
        
        window.eventEmitter.emit("theme", { theme: document.body.classList.contains("dark-mode-variables") ? "dark" : "light" });
    });

    /*const socket = new WebSocket('ws://127.0.0.1:8082')
    socket.onopen = function(e) {
      alert("[open] Connection established");
      alert("Sending to server");
      socket.send(JSON.stringify({ type: 'subscribe', name: 'cars' }));
    };

    socket.onmessage = function(event) {
      alert(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
      }
    };

    socket.onerror = function(error) {
      alert(`[error]`);
      console.error(error);
    };

    window.socket = socket;*/
})();