let onionCount = 0;
let cash = 0;
let exp = 0;
let level = 1;
let requiredExp = 20;
let perkPointsCount = 0;
let doubleHarvest = 0.1; 
let expPerClick = 1;
let stamina = 1000;
let maxStamina = 1000;
let staminaDrain = 10;
let perHarvest = 1;
let onionPrice = 0.5;

// Initial values for attributes
let strength = 1;
let intelligence = 1;
let endurance = 1;
let luck = 1;

function clickOnion() {
  if (stamina >= staminaDrain) {
    // Check for double harvest chance
    if (Math.random() <= doubleHarvest) {
      onionCount += 2 * strength; // Double yield for double harvest
    } else {
      onionCount += strength; // Regular yield
    }

    exp += expPerClick;
    stamina -= staminaDrain;


    // Check for level up
    if (exp >= requiredExp) {
      levelUp();
    }

    updateUI();
  }
}

function sellOnions() {
  if (onionCount > 0) {
    cash += onionCount * onionPrice;
    onionCount = 0;
    updateUI();
  }
}

function assignPerk(stat) {
  if (perkPointsCount > 0) {
    switch (stat) {
      case 'strength':
        strength++;
        perHarvest++;
        break;
      case 'intelligence':
        intelligence++;
        expPerClick++;
        break;
      case 'endurance':
        endurance++;
        maxStamina += 50;
        break;
      case 'luck':
        luck++;
        doubleHarvest += 0.005;
        break;
      default:
        break;
    }

    perkPointsCount--;
    updateUI();
  }
}

function levelUp() {
  level++;
  exp = 0; // Reset current exp to 0 upon leveling up
  requiredExp = Math.floor(level * 1.5) * 10;
  perkPointsCount++;
  updateUI();
}

function regenerateStamina() {
  // Regenerate stamina by 5 every second (adjust as needed)
  if (stamina < maxStamina) {
    stamina += 5;
    updateUI();
  }
}

// Set interval for stamina regeneration
setInterval(regenerateStamina, 1000);

function updateUI() {
  document.getElementById('onionCount').innerText = onionCount;
  document.getElementById('cash').innerText = cash;
  document.getElementById('level').innerText = level;
  document.getElementById('currentExp').innerText = exp;
  document.getElementById('requiredExp').innerText = requiredExp;
  document.getElementById('perkPointsCount').innerText = perkPointsCount;
  document.getElementById('doubleHarvest').innerText = (doubleHarvest * 100).toFixed(1) + '%';
  document.getElementById('expPerClick').innerText = expPerClick;
  document.getElementById('staminaDrain').innerText = staminaDrain;
  document.getElementById('perHarvest').innerText = perHarvest;
  document.getElementById('strengthValue').innerText = strength;
  document.getElementById('intelligenceValue').innerText = intelligence;
  document.getElementById('enduranceValue').innerText = endurance;
  document.getElementById('luckValue').innerText = luck;

  // Enable/disable sell button based on onion count
  document.getElementById('sell-btn').disabled = onionCount === 0;

  // Update progress bars
  document.getElementById('exp-bar').style.width = (exp / requiredExp) * 100 + '%';
  document.getElementById('staminaBar').style.width = (stamina / maxStamina) * 100 + '%';
  document.getElementById('staminaLabel').innerText = `${stamina} / ${maxStamina}`;
}

// Initial UI update
updateUI();

function toggleCollapse(collapseId) {
    var collapseDiv = document.querySelector('.' + collapseId);
    collapseDiv.classList.toggle('hidden');
  }

class Worker {
  constructor(name, baseCost, baseHarvest, baseSpeed) {
    this.name = name;
    this.baseCost = baseCost;
    this.baseHarvest = baseHarvest;
    this.baseSpeed = baseSpeed;
    this.cost = baseCost;
    this.level = 0;
    this.harvest = baseHarvest;
    this.speed = baseSpeed;
    this.progress = 0;
    this.maxProgress = 100;
    this.timerId = null;
    this.buyButton = document.getElementById(`${this.name}-buy`);
    this.progressBar = document.getElementById(`${this.name}-progress-bar`);
    this.levelDisplay = document.getElementById(`${this.name}-lvl`);
    this.costDisplay = document.getElementById(`${this.name}-cost`);
    this.harvestDisplay = document.getElementById(`${this.name}-harvest`);
    this.buyButton.addEventListener("click", () => this.buy());
    this.updateDisplay();
  }

  buy() {
    if (cash >= this.cost) {
      cash -= this.cost;
      this.level++;
      this.updateHarvest(); // Call updateHarvest() to update perHarvest based on the new level
      this.cost = Math.ceil(this.cost * 1.5);
      this.updateDisplay();
      this.startWorking();
      cashEl.innerText = cash.toFixed(2);
    }
  }

  updateHarvest() {
    this.perHarvest = this.baseHarvest * this.level;
    this.updateDisplay();
  }

  startWorking() {
    if (this.progress === 0) {
      this.timerId = setInterval(() => this.updateProgress(), this.speed * 10);
    }
  }

  updateProgress() {
    this.progress++;
    if (this.progress >= this.maxProgress) {
      this.finishWork();
    } else {
      this.updateProgressBar();
    }
  }

  finishWork() {
    this.progress = 0;
    onionCount += this.perHarvest; // Add harvested onions to the total count
    updateUI();
    clearInterval(this.timerId);
    this.startWorking();
  }

  updateProgressBar() {
    const percent = (this.progress / this.maxProgress) * 100;
    this.progressBar.style.width = `${percent}%`;
  }

  updateDisplay() {
    this.levelDisplay.innerText = this.level;
    this.costDisplay.innerText = this.cost;
    this.harvestDisplay.innerText = this.harvest;
  }
}
const yotsubaWorker = new Worker("yotsuba", 3, 1, 60);
const monkeyWorker = new Worker("monkey", 6, 2, 5);
const clownWorker = new Worker("clown", 30, 5, 8);
const malcolmWorker = new Worker("malcolm", 250, 16, 12);
const robotWorker = new Worker("robot", 700, 33, 20);

monkeyWorker.updateHarvest();
clownWorker.updateHarvest();
malcolmWorker.updateHarvest();
robotWorker.updateHarvest();

var ctx = document.getElementById('onionPriceChart').getContext('2d');
var onionPriceChart;

// Function to initialize or reinitialize the chart
function initializeChart() {
  if (onionPriceChart) {
    onionPriceChart.destroy();
  }

  onionPriceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Onion Price',
        data: [],
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
        
      },
      scales: {
        x: {
          type: 'linear',
          beginAtZero: true,
          ticks:  {
            display: false}
        },
        y: {
          min: 0,
          ticks:  {
            display: false}
        }
      },
    }
  });
}

// Function to update onionPrice and chart
function updateOnionPriceAndChart() {
  // Update onionPrice every 30 seconds
  var onionPrice = Math.random() * 2; // Replace this with your logic to update onionPrice
  document.getElementById('onionPrice').innerText = onionPrice.toFixed(2);

  // Update chart data
  var chartData = onionPriceChart.data;
  var labels = chartData.labels;
  var dataset = chartData.datasets[0].data;

  // Add the new data
  labels.push(labels.length);
  dataset.push(onionPrice);

  // Check if the data array is too long, and remove the oldest value
  if (labels.length > 14) {
    dataset.shift();
  }

  // Update chart
  onionPriceChart.update();

  // Update stock change
  var stockChange = ((onionPrice - dataset[0]) / dataset[0]) * 100;
  document.getElementById('stock-change').innerText = stockChange.toFixed(2) + '%';
}

// Set interval for updating onionPrice and chart
setInterval(function () {
  updateOnionPriceAndChart();

}, 3000);

// Initial chart initialization
initializeChart();

