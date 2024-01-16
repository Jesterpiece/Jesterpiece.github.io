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