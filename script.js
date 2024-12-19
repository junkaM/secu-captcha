const form = document.getElementById("sequence-form");
const output = document.getElementById("output");
const captchaContainer = document.getElementById("captcha-container");
const captchaSolvedButton = document.getElementById("captcha-solved");

let stopSequence = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  output.innerHTML = ""; 
  captchaContainer.classList.add("hidden"); 

  const n = parseInt(document.getElementById("number-input").value, 10);
  stopSequence = false;

  for (let i = 1; i <= n; i++) {
    if (stopSequence) break;

    try {
      const response = await fetch("https://api.prod.jcloudify.com/whoami");
      const line = document.createElement("div");

      if (response.status === 403) {
        line.textContent = `${i}. Forbidden`;
      } else if (response.status === 200) {
        line.textContent = `${i}. Success`;
      } else {
        line.textContent = `${i}. Unexpected response`;
      }

      output.appendChild(line);
    } catch (error) {
      if (error.message.includes("captcha")) {
        stopSequence = true;
        captchaContainer.classList.remove("hidden");
        return;
      }
      const errorLine = document.createElement("div");
      errorLine.textContent = `${i}. Error: ${error.message}`;
      output.appendChild(errorLine);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});

captchaSolvedButton.addEventListener("click", () => {
  stopSequence = false;
  captchaContainer.classList.add("hidden");
  output.textContent += "Captcha solved. Resuming...\n";
});
