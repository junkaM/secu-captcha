const form = document.getElementById('sequence-form');
const output = document.getElementById('output');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  output.textContent = ''; 

  const n = parseInt(document.getElementById('number-input').value, 10);

  for (let i = 1; i <= n; i++) {
    try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${API_KEY}` // Inclure la clé API dans les headers
          }
        });
  
        if (response.status === 403) {
          output.textContent += `${i}. Forbidden (403)\n`;
        } else if (response.status === 200) {
          output.textContent += `${i}. Success (200)\n`;
        } else if (response.status === 405) {
          output.textContent += `${i}. CAPTCHA Required (405)\n`;
          stopSequence = true;
          captchaContainer.style.display = 'block';
          break;
        } else {
          output.textContent += `${i}. Unexpected response: ${response.status}\n`;
        }
      } catch (error) {
        output.textContent += `${i}. Network Error: ${error.message}\n`;
        console.error(`Error on request ${i}:`, error);
      }
  
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause de 1 seconde
    }
});
