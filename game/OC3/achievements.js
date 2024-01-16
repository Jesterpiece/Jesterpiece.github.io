class Achievement {
    constructor(id, name, targetAmount) {
      this.id = id;
      this.name = name;
      this.targetAmount = targetAmount;
      this.progress = 0;
      this.unlocked = false;
    }
  
    updateProgress(amount) {
        this.progress += amount;
        if (this.progress >= this.targetAmount && !this.unlocked) {
          this.unlock();
        }
    
        // Clamp progress to target amount
        this.progress = Math.min(this.progress, this.targetAmount);
    
        this.updateUI();
      }
    
  
    unlock() {
      this.unlocked = true;
      this.progress = this.targetAmount; // Clamp progress to target amount
      this.updateUI();
    }
  
    updateUI() {
      const achBox = document.getElementById(`ach${this.id}`);
      const achImage = achBox.querySelector('.ach-left-div img');
      const achTitle = achBox.querySelector('.ach-right-div h3');
      const achProgress = achBox.querySelector('.ach-right-div span');
      const achDescription = achBox.querySelector('.description-achievement');
  
      if (this.unlocked) {
        achImage.src = `ach${this.id}.png`;
        achTitle.style.color = '#02b576';
        achDescription.style.color = '#02b576';
      }
  
      achProgress.textContent = `(${(this.progress / this.targetAmount * 100).toFixed(0)}%)`;
    }
  }
  
  // Define achievements
  const achievements = [
    new Achievement(1, 'The beginning', 1),
    new Achievement(2, 'Monthly onion supply', 14),
    new Achievement(3, 'The beginning', 88),
    new Achievement(4, 'Monthly onion supply', 1000)
  ];
  
  // Update UI for all achievements
  function updateAllAchievementsUI() {
    achievements.forEach(achievement => {
      achievement.updateUI();
    });
  }
  
  // Modify clickOnion function to update achievements
  function clickOnion() {
    if (stamina >= staminaDrain) {
      if (Math.random() <= doubleHarvest) {
        onionCount += 2 * strength;
      } else {
        onionCount += strength;
      }
  
      exp += expPerClick;
      stamina -= staminaDrain;
  
      // Update achievements
      achievements.forEach(achievement => {
        achievement.updateProgress(strength);
      });
  
      if (exp >= requiredExp) {
        levelUp();
      }
  
      updateUI();
    }
  }
  
  // Initial UI update for achievements
  updateAllAchievementsUI();