class LottoNumbers extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set numbers(numbers) {
    this._numbers = numbers;
    this.render();
  }

  get numbers() {
    return this._numbers;
  }

  render() {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue(
      document.body.classList.contains('light-mode') ? '--accent-color-light' : '--accent-color-dark'
    );

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
          background-color: ${accentColor};
          display: grid;
          place-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          box-shadow: 0 0 1rem ${accentColor};
        }
      </style>
      <div class="numbers-container">
        ${this.numbers ? this.numbers.map(num => `<div class="number">${num}</div>`).join('') : ''}
      </div>
    `;
  }
}

customElements.define('lotto-numbers', LottoNumbers);

const generateBtn = document.getElementById('generate-btn');
const lottoDisplay = document.querySelector('lotto-numbers');
const historyList = document.getElementById('history-list');
const themeSwitch = document.getElementById('checkbox');

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

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-mode');
  // Re-render the lotto numbers to update the color
  lottoDisplay.render();
});

// Initial generation
generateBtn.click();