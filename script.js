const form = document.getElementById('sequence-form');
const output = document.getElementById('output');
const captchaContainer = document.getElementById('captcha-container');
const captchaSolvedButton = document.getElementById('captcha-solved');

let stopSequence = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  output.textContent = '';

  const n = parseInt(document.getElementById('number-input').value, 10);
  stopSequence = false;

  for (let i = 1; i <= n; i++) {
    if (stopSequence) break;

    try {
      const response = await fetch('https://api.prod.jcloudify.com/whoami');

      if (response.status === 403) {
        output.textContent += `${i}. Forbidden\n`;
      } else if (response.status === 200) {
        output.textContent += `${i}. Success\n`;
      } else {
        output.textContent += `${i}. Unexpected response\n`;
      }
    } catch (error) {
      if (error.message.includes('captcha')) {
        stopSequence = true;
        captchaContainer.style.display = 'block';
        return;
      }
      output.textContent += `${i}. Error\n`;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});

captchaSolvedButton.addEventListener('click', () => {
  stopSequence = false;
  captchaContainer.style.display = 'none';
  output.textContent += 'Captcha solved. Resuming...\n';
});