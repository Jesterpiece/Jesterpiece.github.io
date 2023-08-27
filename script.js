const harvestBtn = document.getElementById("harvest-btn");
const sellBtn = document.getElementById("sell-btn");
const kgOnionsEl = document.getElementById("kg-onions");
const cashEl = document.getElementById("cash");
const perHarvestEl = document.getElementById("per-harvest");
const stockPriceEl = document.getElementById("stock-price");
const stockChangeEl = document.getElementById("stock-change");
const stockUpdatesEl = document.getElementById("stock-updates");
sellBtn.addEventListener("click", handleSellClick);

let kgOnions = 0;
let cash = 0;
let perHarvest = 1;
let stockPrice = 1;
let stockPriceHistory = [];
let stockUpdatesInterval;

// Define a function to handle the "Harvest Onions" button click
function handleHarvestClick() {
  // Increase the number of onions by the perHarvest value and update the UI
  kgOnions += perHarvest;
  kgOnionsEl.innerText = kgOnions;

  // Update the "Per Harvest" display
  perHarvestEl.innerText = perHarvest;

  // Enable the "Sell Onions" button
  sellBtn.disabled = false;
}

function handleSellClick() {
  // Update the cash value and update the UI
  cash += kgOnions * stockPrice;
  cashEl.innerText = cash.toFixed(2);

  // Decrease the number of onions by the amount sold and update the UI
  kgOnions = 0;
  kgOnionsEl.innerText = kgOnions;

  // Disable the "Sell Onions" button
  sellBtn.disabled = true;
}

const chart = new Chart("stockchart", {
  type: "line",
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,0,0,1.0)",
        borderColor: "rgba(255,255,255,1.0)",
        data: []
      }
    ]
  },
  options: {
    legend: { display: false },
    scales: {
      yAxes: [{ ticks: { min: 0, max: 3 } }],
      xAxes: [{ ticks: { min: 1, max: 8, display: false } }]
    }
  }
});

const addData = (data) => {
  const chartData = chart.data.datasets[0].data;
  chartData.push(data);
  if (chartData.length > 8) {
    chartData.shift();
  }
  chart.update();
};

// Define a function to update the stock price
function updateStockPrice() {
  // Generate a random value between -0.15 and 0.15
  const stockPriceChange = (Math.random() - 0.5) * 0.3;

  // Calculate the percentage change
  const stockChange = ((stockPrice + stockPriceChange - stockPrice) / stockPrice) * 100;

  // Clamp the stock price to the range [0.1, 3]
  stockPrice = Math.max(0.1, Math.min(stockPrice + stockPriceChange, 3));
  stockPriceEl.innerText = stockPrice.toFixed(2);

  // Update the stock change display
  const stockChangeEl = document.getElementById("stock-change");
  stockChangeEl.innerText = `${stockChange.toFixed(2)}%`;

  if (stockChange < 0) {
    stockChangeEl.style.color = "red";
  } else if (stockChange > 0) {
    stockChangeEl.style.color = "green";
  } else {
    stockChangeEl.style.color = "white";
  }

  // Clear the previous interval
  clearInterval(stockUpdatesInterval);

  // Update the stock updates countdown every second
  let stockUpdatesCountdown = 30;
  stockUpdatesEl.innerText = `${stockUpdatesCountdown} seconds`;
  stockUpdatesInterval = setInterval(() => {
    stockUpdatesCountdown--;
    stockUpdatesEl.innerText = `${stockUpdatesCountdown} seconds`;
    if (stockUpdatesCountdown === 0) {
      clearInterval(stockUpdatesInterval);
      updateStockPrice();
    }
  }, 1000);

  // Add the new stock price to the chart
  addData(stockPrice);
}

// Update the stock price every 30 seconds
updateStockPrice(); // Update stock price on page load
setInterval(updateStockPrice, 30000);

// Make Onion scale on click
const svg = document.getElementById('OnionButton');

svg.addEventListener('click', function() {
  svg.classList.add('animate');
  setTimeout(function() {
    svg.classList.remove('animate');
  }, 100);
});

// WORKERS!!! Remember that, retard!!!!

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
      this.cost = Math.ceil(this.cost * 1.9 + 2);
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
    harvestOnion(true, this.perHarvest); // Pass the worker's total onions harvested
    kgOnions += this.perHarvest; // No need to add onions here, as it's already added in harvestOnion()
    kgOnionsEl.innerText = kgOnions;
    sellBtn.disabled = false;
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
const monkeyWorker = new Worker("monkey", 6, 2, 5);
const clownWorker = new Worker("clown", 30, 5, 8);
const malcolmWorker = new Worker("malcolm", 250, 16, 12);

monkeyWorker.updateHarvest();
clownWorker.updateHarvest();
malcolmWorker.updateHarvest();

let onionsHarvested = 0;

const achievements = [
  { condition: 100, progress: 0, elementId: "harvestedProgress0" }, // "The beginning" achievement
  { condition: 1500, progress: 0, elementId: "harvestedProgress1" }, // "Monthly onion supply" achievement
  // Add more achievements as needed
];

// Function to update the progress for each achievement based on the onions harvested
function updateAchievementProgress() {
  achievements.forEach((achievement, index) => {
    const progress = (onionsHarvested / achievement.condition) * 100;
    achievement.progress = Math.min(progress, 100); // Clamp progress to 100%
    const progressText = document.getElementById(achievement.elementId);
    progressText.innerText = `(${achievement.progress.toFixed(0)}%)`;

    // Check if the achievement condition is met (harvested enough onions)
    if (achievement.progress >= 100) {
      // Add your code to trigger the achievement reward here
      progressText.style.color = "green";
    } else {
      progressText.style.color = "white"; // Reset the text color to white
    }
  });
}

// Function to handle player and worker onion harvests
function harvestOnion(workerHarvest = false, totalHarvest = 1) {
  if (workerHarvest) {
    onionsHarvested += totalHarvest;
  } else {
    onionsHarvested++;
  }
  updateAchievementProgress(); // Update achievement progress when onions are harvested
}