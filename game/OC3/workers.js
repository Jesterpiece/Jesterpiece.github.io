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