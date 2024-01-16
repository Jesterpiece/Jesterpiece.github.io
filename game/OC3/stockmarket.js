var ctx = document.getElementById('onionPriceChart').getContext('2d');
var onionPriceChart;
var stuckThreshold = 0.3;
var stuckDuration = 0;
var maxStuckDuration = 60000; // 1 minute in milliseconds
var boostPercentage = 300;
var crashMinPercentage = 70;
var crashMaxPercentage = 90;

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
                fill: true,
                data: [],
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 2,
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
                    ticks: {
                        display: false
                    }
                },
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        display: true
                    }
                }
            },
        }
    });

    // Generate an initial onion price and update the chart
    var initialOnionPrice = 0.5
    document.getElementById('onionPrice').innerText = initialOnionPrice.toFixed(2);

    // Update chart data
    var chartData = onionPriceChart.data;
    var labels = chartData.labels;
    var dataset = chartData.datasets[0].data;

    // Add the initial data
    labels.push(labels.length);
    dataset.push(initialOnionPrice);

    // Update chart
    onionPriceChart.update();

    // Initialize stock change text and color
    document.getElementById('stock-change').innerText = '0.00%';
    document.getElementById('stock-change').style.color = 'green';
}

function updateOnionPriceAndChart() {
    // Get the current onion price
    var currentOnionPrice = parseFloat(document.getElementById('onionPrice').innerText);

    // Check if the onion price is below the stuck threshold
    if (currentOnionPrice < stuckThreshold) {
        // Increment the stuck duration
        stuckDuration += 300; // Assuming the interval is 300 milliseconds

        // Check if the stuck duration exceeds the maximum allowed duration
        if (stuckDuration >= maxStuckDuration) {
            // Boost the onion price
            var boostFactor = 1 + boostPercentage / 100;
            currentOnionPrice *= boostFactor;

            // Reset the stuck duration
            stuckDuration = 0;
        }
    } else {
        // Reset the stuck duration if the onion price is above the threshold
        stuckDuration = 0;
    }

    // Generate a random percentage change between -30% and +30%
    var percentageChange = (Math.random() * 60) - 30;

    // Calculate the new onion price based on the percentage change
    var onionPrice = currentOnionPrice + (currentOnionPrice * (percentageChange / 100));

    // Ensure the new onion price is within a reasonable range (e.g., between 0.1 and 5.0)
    onionPrice = Math.max(0.1, Math.min(onionPrice, 5.0));

    // Check if the onion price is too high for a crash
    if (onionPrice > 3) {
        var crashPercentage = Math.random() * (crashMaxPercentage - crashMinPercentage) + crashMinPercentage;
        onionPrice *= 1 - crashPercentage / 100;
    }

    // Update the onion price display
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

    // Calculate stock change percentage
    var stockChange;
    if (dataset.length > 1) {
        stockChange = ((onionPrice - dataset[dataset.length - 2]) / dataset[dataset.length - 2]) * 100; // Compare with the previous value
    } else {
        stockChange = 0; // Set to 0 if there's no previous value
    }

    var stockChangeElement = document.getElementById('stock-change');

    // Update stock change text
    stockChangeElement.innerText = stockChange.toFixed(2) + '%';

    // Update text color based on the sign of the percentage change
    stockChangeElement.style.color = stockChange >= 0 ? 'green' : 'red';
}

// Set interval for updating onionPrice and chart
setInterval(function () {
    updateOnionPriceAndChart();
}, 10000);

// Initial chart initialization
initializeChart();