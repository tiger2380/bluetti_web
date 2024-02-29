const inputs = document.querySelectorAll(".otp-card-inputs input");
const button = document.querySelector(".otp-card button");

inputs.forEach((input) => {
  let lastInputStatus = 0;
  input.onkeyup = (e) => {
    const currentElement = e.target;
    const nextElement = input.nextElementSibling;
    const prevElement = input.previousElementSibling;

    if (prevElement && e.keyCode === 8) {
      if (lastInputStatus === 1) {
        prevElement.value = "";
        prevElement.focus();
      }
      button.setAttribute("disabled", true);
      lastInputStatus = 1;
    } else {
      const reg = /^[0-9]+$/;
      if (!reg.test(currentElement.value)) {
        currentElement.value = currentElement.value.replace(/\D/g, "");
      } else if (currentElement.value) {
        if (nextElement) {
          nextElement.focus();
        } else {
          button.removeAttribute("disabled");
          lastInputStatus = 0;
        }
      }
    }
  };
});

button.addEventListener("click", async (e) => {
  e.preventDefault();

  const form = document.querySelector(".otp-card form");
  const formAction = form.getAttribute("action");

  button.setAttribute("disabled", true);
  let code = "";
  inputs.forEach((input) => {
    code += input.value;
  });

  const response = await fetch(`${formAction}`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code, email: "thaddeus.bibbs@hotmail.com" }),
  });

  const json = await response.json();
  button.removeAttribute("disabled");
  document.querySelector("#snackbar").innerHTML = json.message;
  showSnackbar();

  if (json.status) {
    window.location.href = "/account";
  }
});
