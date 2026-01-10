class LottoNumbers extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set numbers(numbers) {
    this.shadowRoot.innerHTML = `
      <style>
        .numbers-container {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .number {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-color: var(--accent-color);
          display: grid;
          place-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          box-shadow: 0 0 1rem var(--accent-color);
        }
      </style>
      <div class="numbers-container">
        ${numbers.map(num => `<div class="number">${num}</div>`).join('')}
      </div>
    `;
  }
}

customElements.define('lotto-numbers', LottoNumbers);

const generateBtn = document.getElementById('generate-btn');
const lottoDisplay = document.querySelector('lotto-numbers');
const historyList = document.getElementById('history-list');

function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

generateBtn.addEventListener('click', () => {
  const newNumbers = generateLottoNumbers();
  lottoDisplay.numbers = newNumbers;

  const historyItem = document.createElement('li');
  historyItem.textContent = newNumbers.join(', ');
  historyList.prepend(historyItem);
});

// Initial generation
generateBtn.click();