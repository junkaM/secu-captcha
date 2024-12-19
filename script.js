const form = document.getElementById('sequence-form');
const output = document.getElementById('output');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  output.textContent = ''; 

  const n = parseInt(document.getElementById('number-input').value, 10);

  for (let i = 1; i <= n; i++) {
    try {
      // Perform the API request
      const response = await fetch('https://api.prod.jcloudify.com/whoami');

      if (response.status === 403) {
        output.textContent += `${i}. Forbidden\n`;
      } else if (response.status === 405) {
        output.textContent += `${i}. Captcha required\n`;
        console.log("Captcha triggered. AWS WAF will handle it.");
        break;
        
      } else {
        output.textContent += `${i}. Unexpected response: ${response.status}\n`;
      }
    } catch (error) {
      console.error(`Error on request ${i}:`, error);
      output.textContent += `${i}. Error\n`;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
