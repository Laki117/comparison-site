document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const comparisonTabs = document.getElementById('comparisonTabs');
  const productContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-8.mb-12');
  
  // Chart instances
  let benchmarkChart, batteryChart, displayChart, realWorldChart;
  
  // Initialize popular products
  fetchPopularProducts();
  
  // Add event listeners
  searchBtn.addEventListener('click', handleSearchClick);
  
  // Add event listener to tabs
  if (comparisonTabs) {
    const tabButtons = comparisonTabs.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        activateTab(tabId);
      });
    });
  }
  
  // Functions
  // Add this to public/js/main.js - replace or enhance the current showLoading function
function showLoading() {
    // Clear any existing content in product cards to indicate a change is happening
    if (productContainer) {
        const originalContent = productContainer.innerHTML;
        productContainer.setAttribute('data-original-content', originalContent);
        
        // Add skeleton loaders to indicate loading
        productContainer.innerHTML = `
            <div class="card bg-white p-6 animate-pulse">
                <div class="flex flex-col md:flex-row items-center md:items-start">
                    <div class="w-48 h-48 bg-gray-200 rounded mb-4 md:mb-0 md:mr-6"></div>
                    <div class="w-full">
                        <div class="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                        <div class="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    </div>
                </div>
            </div>
            <div class="card bg-white p-6 animate-pulse">
                <div class="flex flex-col md:flex-row items-center md:items-start">
                    <div class="w-48 h-48 bg-gray-200 rounded mb-4 md:mb-0 md:mr-6"></div>
                    <div class="w-full">
                        <div class="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                        <div class="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Activate the loading overlay with improved styling
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    // Add status message that updates to show progress
    const statusMessage = document.createElement('div');
    statusMessage.id = 'loadingStatus';
    statusMessage.className = 'mt-4 text-center';
    statusMessage.innerHTML = `
        <p class="text-gray-700 mb-2">Generating comparison...</p>
        <div class="flex justify-center items-center space-x-2">
            <span class="loading-status">Searching products</span>
            <span class="loading-dots">...</span>
        </div>
    `;
    
    // Add or update the status message
    const existingStatus = document.getElementById('loadingStatus');
    if (existingStatus) {
        existingStatus.replaceWith(statusMessage);
    } else {
        loadingOverlay.appendChild(statusMessage);
    }
    
    // Simulate progressive loading status
    let currentStep = 0;
    const steps = ['Searching products', 'Analyzing specifications', 'Generating comparisons', 'Creating visualizations'];
    
    window.loadingInterval = setInterval(() => {
        const statusSpan = document.querySelector('.loading-status');
        const dotsSpan = document.querySelector('.loading-dots');
        
        if (statusSpan && dotsSpan) {
            // Update dots animation
            if (dotsSpan.textContent.length >= 3) {
                dotsSpan.textContent = '.';
            } else {
                dotsSpan.textContent += '.';
            }
            
            // Update step text
            currentStep = (currentStep + 1) % steps.length;
            statusSpan.textContent = steps[currentStep];
        }
    }, 800);
}

// Replace or enhance the current hideLoading function
function hideLoading() {
    // Clear the loading interval
    if (window.loadingInterval) {
        clearInterval(window.loadingInterval);
        window.loadingInterval = null;
    }
    
    // Hide the loading overlay with a fade-out effect
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('fade-out');
    
    // After fade animation, remove the active and fade-out classes
    setTimeout(() => {
        loadingOverlay.classList.remove('active', 'fade-out');
    }, 500);
    
    // Restore original content if comparison failed
    if (productContainer && productContainer.hasAttribute('data-original-content') &&
        !productContainer.querySelector('h3')) {
        productContainer.innerHTML = productContainer.getAttribute('data-original-content');
        productContainer.removeAttribute('data-original-content');
    }
}
  
  function activateTab(tabId) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Charts are initialized/updated only when data is received via updateChartsData
  }
  
function initializeCharts() {
  // Only initialize if canvas elements exist and charts aren't already initialized
  if (document.getElementById('benchmarkChart') && !benchmarkChart) {
    const benchmarkCtx = document.getElementById('benchmarkChart').getContext('2d');
    benchmarkChart = new Chart(benchmarkCtx, {
      type: 'bar',
      data: {
        labels: ['Single-Core', 'Multi-Core', 'GPU', 'AnTuTu', 'Geekbench'],
        datasets: [
          {
            label: 'iPhone 16',
            data: [1700, 4800, 14000, 950000, 6200],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Samsung Galaxy S24',
            data: [1500, 5200, 12500, 1100000, 5800],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Benchmark Scores (Higher is Better)'
          }
        }
      }
    });
  }

  if (document.getElementById('batteryChart') && !batteryChart) {
    const batteryCtx = document.getElementById('batteryChart').getContext('2d');
    batteryChart = new Chart(batteryCtx, {
      type: 'bar',
      data: {
        labels: ['Web Browsing', 'Video Playback', 'Gaming'],
        datasets: [
          {
            label: 'iPhone 16',
            data: [12, 18, 6],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Samsung Galaxy S24',
            data: [11, 20, 5],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Battery Life in Hours (Higher is Better)'
          }
        }
      }
    });
  }

  if (document.getElementById('displayChart') && !displayChart) {
    const displayCtx = document.getElementById('displayChart').getContext('2d');
    displayChart = new Chart(displayCtx, {
      type: 'radar',
      data: {
        labels: ['Brightness', 'Color Accuracy', 'Refresh Rate', 'Resolution', 'HDR Quality'],
        datasets: [
          {
            label: 'iPhone 16',
            data: [90, 95, 85, 88, 92],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(59, 130, 246)'
          },
          {
            label: 'Samsung Galaxy S24',
            data: [95, 88, 90, 86, 94],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(16, 185, 129)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Display Quality (Higher is Better)'
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });
  }

  if (document.getElementById('realWorldChart') && !realWorldChart) {
    const realWorldCtx = document.getElementById('realWorldChart').getContext('2d');
    realWorldChart = new Chart(realWorldCtx, {
      type: 'bar',
      data: {
        labels: ['App Loading', 'Photo Processing', 'Video Export', 'Web Browsing'],
        datasets: [
          {
            label: 'iPhone 16',
            data: [0.8, 3.2, 15, 0.9],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Samsung Galaxy S24',
            data: [1.0, 2.9, 13, 1.1],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Task Completion Time in Seconds (Lower is Better)'
          }
        }
      }
    });
  }
}
  
// Update the handleSearchClick function in main.js to better coordinate updates
async function handleSearchClick() {
    const searchQuery = searchInput.value.trim();
    
    if (!searchQuery) {
        alert('Please enter products to compare');
        return;
    }
    
    showLoading();
    
    try {
        // Parse search query to extract products
        let products = [];
        if (searchQuery.includes('vs')) {
            products = searchQuery.split('vs').map(p => p.trim());
        } else {
            // Use Brave Search to find products
            const searchResult = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await searchResult.json();
            
            if (data.web && data.web.results) {
                // Extract product names
                for (const result of data.web.results.slice(0, 5)) {
                    if (result.title.toLowerCase().includes('vs')) {
                        const titleParts = result.title.split('vs');
                        if (titleParts.length >= 2) {
                            products = [
                                titleParts[0].trim().replace(/compare|best|top|review/gi, '').trim(),
                                titleParts[1].trim().replace(/compare|best|top|review/gi, '').trim()
                            ];
                            break;
                        }
                    }
                }
            }
            
            if (products.length < 2) {
                // Default to iPhone vs Galaxy if no comparison found
                products = [`${searchQuery}`, 'Samsung Galaxy S24'];
            }
        }
        
        // Update loading status
        const loadingStatus = document.querySelector('.loading-status');
        if (loadingStatus) {
            loadingStatus.textContent = 'Generating detailed comparison';
        }
        
        // Get comparison data from Gemini
        const compareResponse = await fetch('/api/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products })
        });
        
        const comparisonData = await compareResponse.json();
        
        // Check if there's an error in the response
        if (comparisonData.error) {
            throw new Error(comparisonData.error);
        }
        
        // Update the UI with comparison data
        updateComparisonUI(comparisonData);
        
        // Reset to the first tab
        activateTab('specifications');
        
        // Scroll to the top of the comparison section
        const comparisonSection = document.querySelector('#comparisonTabs');
        if (comparisonSection) {
            comparisonSection.scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error('Error during search:', error);
        alert('Failed to generate comparison. Please try again. ' + error.message);
    } finally {
        hideLoading();
    }
}
  
// Enhance the updateComparisonUI function to ensure all sections are updated
function updateComparisonUI(data) {
    console.log("Updating UI with data:", data); // Debug log
    
    // Update document title
    document.title = `TechCompare - ${data.products[0].name} vs ${data.products[1].name}`;
    
    // Update main heading
    const mainHeading = document.querySelector('h2.text-3xl.font-bold.mb-2');
    if (mainHeading) {
        mainHeading.textContent = `${data.products[0].name} vs ${data.products[1].name}`;
    }
    
    // Update description
    const description = document.querySelector('h2.text-3xl.font-bold.mb-2 + p.text-gray-600.mb-8');
    if (description) {
        description.textContent = `Comprehensive comparison of ${data.products[0].name} and ${data.products[1].name}`;
    }
    
    // Update product cards
    updateProductCards(data);
    
    // Update each section - ensure each method properly handles missing data
    console.log("Updating specifications tab...");
    updateSpecificationsTab(data);
    
    console.log("Updating features tab...");
    updateFeaturesTab(data);
    
    console.log("Updating performance tab...");
    updatePerformanceTab(data);
    
    console.log("Updating cameras tab...");
    updateCamerasTab(data);
    
    console.log("Updating pricing tab...");
    updatePricingTab(data);
    
    console.log("Updating reviews tab...");
    updateReviewsTab(data);
    
    console.log("Updating AI recommendations...");
    updateAIRecommendations(data);
    
    // Initialize and update charts with new data
    console.log("Updating charts...");
    updateChartsData(data);
}

// Add this helper function to update product cards
function updateProductCards(data) {
    if (!productContainer || !data.products || data.products.length < 2) {
        console.warn("Cannot update product cards: missing container or data");
        return;
    }
    
    productContainer.innerHTML = '';
    
    // Generate product cards
    data.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card bg-white p-6';
        card.innerHTML = `
            <div class="flex flex-col md:flex-row items-center md:items-start">
                <img src="${getProductImage(product.name)}" alt="${product.name}" class="w-48 h-48 object-contain mb-4 md:mb-0 md:mr-6">
                <div>
                    <h3 class="text-2xl font-bold mb-2">${product.name}</h3>
                    <div class="star-rating flex items-center mb-2">
                        ${generateStarRating(product.rating)}
                        <span class="ml-2 text-gray-600">${product.rating} (${product.reviewCount} reviews)</span>
                    </div>
                    <p class="text-xl font-bold text-indigo-600 mb-2">${product.price}</p>
                    <p class="text-gray-600 mb-2">Release Date: ${product.releaseDate}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${product.storage.map(s => `<span class="px-3 py-1 bg-gray-100 rounded-full text-sm">${s}</span>`).join('')}
                    </div>
                    <p class="text-gray-700">${product.description}</p>
                </div>
            </div>
        `;
        productContainer.appendChild(card);
    });
}
  
function updateChartsData(data) {
  // Check if performance data exists
  if (!data.performance) return;
  
  // First destroy any existing charts by using Chart.js registry
  // This approach is more robust than just checking our own variables
  Object.keys(Chart.instances).forEach(key => {
    const instance = Chart.instances[key];
    if (instance) {
      instance.destroy();
    }
  });
  
  // Reset our chart variables
  benchmarkChart = null;
  batteryChart = null;
  displayChart = null;
  realWorldChart = null;
  
  // Now it's safe to re-initialize charts with new data
  if (document.getElementById('benchmarkChart')) {
    const benchmarkCtx = document.getElementById('benchmarkChart').getContext('2d');
    benchmarkChart = new Chart(benchmarkCtx, {
      type: 'bar',
      data: {
        labels: data.performance.benchmarks.labels || ['Single-Core', 'Multi-Core', 'GPU', 'AnTuTu', 'Geekbench'],
        datasets: [
          {
            label: data.products[0].name,
            data: data.performance.benchmarks.datasets[0].data,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: data.products[1].name,
            data: data.performance.benchmarks.datasets[1].data,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Benchmark Scores (Higher is Better)'
          }
        }
      }
    });
  }
  
  if (document.getElementById('batteryChart')) {
    const batteryCtx = document.getElementById('batteryChart').getContext('2d');
    batteryChart = new Chart(batteryCtx, {
      type: 'bar',
      data: {
        labels: data.performance.batteryLife.labels || ['Web Browsing', 'Video Playback', 'Gaming'],
        datasets: [
          {
            label: data.products[0].name,
            data: data.performance.batteryLife.datasets[0].data,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: data.products[1].name,
            data: data.performance.batteryLife.datasets[1].data,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Battery Life in Hours (Higher is Better)'
          }
        }
      }
    });
  }
  
  if (document.getElementById('displayChart')) {
    const displayCtx = document.getElementById('displayChart').getContext('2d');
    displayChart = new Chart(displayCtx, {
      type: 'radar',
      data: {
        labels: data.performance.displayQuality.labels || ['Brightness', 'Color Accuracy', 'Refresh Rate', 'Resolution', 'HDR Quality'],
        datasets: [
          {
            label: data.products[0].name,
            data: data.performance.displayQuality.datasets[0].data,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(59, 130, 246)'
          },
          {
            label: data.products[1].name,
            data: data.performance.displayQuality.datasets[1].data,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(16, 185, 129)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Display Quality (Higher is Better)'
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });
  }
  
  if (document.getElementById('realWorldChart')) {
    const realWorldCtx = document.getElementById('realWorldChart').getContext('2d');
    realWorldChart = new Chart(realWorldCtx, {
      type: 'bar',
      data: {
        labels: data.performance.realWorld.labels || ['App Loading', 'Photo Processing', 'Video Export', 'Web Browsing'],
        datasets: [
          {
            label: data.products[0].name,
            data: data.performance.realWorld.datasets[0].data,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: data.products[1].name,
            data: data.performance.realWorld.datasets[1].data,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Task Completion Time in Seconds (Lower is Better)'
          }
        }
      }
    });
  }
  
  // Also update chart descriptions
  updateChartDescriptions(data);
}

// New function to update chart descriptions
function updateChartDescriptions(data) {
  if (!data.performance || !data.performance.descriptions) return;
  
  const descriptions = document.querySelectorAll('#performance .card .mt-4.text-sm.text-gray-600 p');
  if (descriptions.length >= 4) {
    for (let i = 0; i < Math.min(descriptions.length, data.performance.descriptions.length); i++) {
      descriptions[i].textContent = data.performance.descriptions[i];
    }
  }
  
  // Update performance analysis
  const analysisContainer = document.querySelector('#performance .card:last-child');
  if (analysisContainer && data.performance.analysis) {
    const generalDesc = analysisContainer.querySelector('p:first-of-type');
    if (generalDesc) {
      generalDesc.textContent = data.performance.analysis.general;
    }
    
    const lists = analysisContainer.querySelectorAll('ul');
    if (lists.length >= 2) {
      // Update product 1 strengths
      const list1 = lists[0];
      list1.innerHTML = '';
      data.performance.analysis.product1Strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        list1.appendChild(li);
      });
      
      // Update product 2 strengths
      const list2 = lists[1];
      list2.innerHTML = '';
      data.performance.analysis.product2Strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        list2.appendChild(li);
      });
    }
    
    const conclusion = analysisContainer.querySelector('p:last-of-type');
    if (conclusion) {
      conclusion.textContent = data.performance.analysis.conclusion;
    }
  }
}
  
  function updateSpecificationsTab(data) {
    const specsTable = document.querySelector('#specifications table tbody');
    if (!specsTable || !data.products || data.products.length < 2) return;
    
    specsTable.innerHTML = '';
    
    const specs1 = data.products[0].specs;
    const specs2 = data.products[1].specs;
    const product1Name = data.products[0].name;
    const product2Name = data.products[1].name;
    
    // Update the header cells with product names
    const headerRow = document.querySelector('#specifications table thead tr');
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('th');
      if (headerCells.length >= 3) {
        headerCells[1].textContent = product1Name;
        headerCells[2].textContent = product2Name;
      }
    }
    
    // Add rows for each specification
    const specRows = [
      { label: 'Display', val1: specs1.display, val2: specs2.display },
      { label: 'Processor', val1: specs1.processor, val2: specs2.processor },
      { label: 'RAM', val1: specs1.ram, val2: specs2.ram },
      { label: 'Rear Camera', val1: specs1.rearCamera, val2: specs2.rearCamera },
      { label: 'Front Camera', val1: specs1.frontCamera, val2: specs2.frontCamera },
      { label: 'Battery', val1: specs1.battery, val2: specs2.battery },
      { label: 'Charging', val1: specs1.charging, val2: specs2.charging },
      { label: 'OS', val1: specs1.os, val2: specs2.os },
      { label: 'Dimensions', val1: specs1.dimensions, val2: specs2.dimensions },
      { label: 'Weight', val1: specs1.weight, val2: specs2.weight },
      { label: 'Water Resistance', val1: specs1.waterResistance, val2: specs2.waterResistance },
      { label: 'Biometrics', val1: specs1.biometrics, val2: specs2.biometrics },
      { label: 'Colors', val1: specs1.colors, val2: specs2.colors }
    ];
    
    specRows.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border-b';
      tr.innerHTML = `
        <td class="py-3 px-4 font-medium">${row.label}</td>
        <td class="py-3 px-4">${row.val1 || '-'}</td>
        <td class="py-3 px-4">${row.val2 || '-'}</td>
      `;
      specsTable.appendChild(tr);
    });
  }
  
  function updateFeaturesTab(data) {
    const featuresContainer = document.getElementById('features');
    if (!featuresContainer || !data.features) return;
    
    featuresContainer.innerHTML = '';
    
    const icons = {
      'Display': 'fas fa-desktop',
      'Performance': 'fas fa-tachometer-alt',
      'Camera': 'fas fa-camera',
      'Battery': 'fas fa-battery-full',
      'Software': 'fas fa-code',
      'Ecosystem': 'fas fa-network-wired',
      'Design': 'fas fa-palette',
      'Connectivity': 'fas fa-wifi'
    };
    
    data.features.forEach(feature => {
      const featureDiv = document.createElement('div');
      featureDiv.className = 'card bg-white p-6';
      
      const iconClass = icons[feature.category] || 'fas fa-question-circle';
      
      featureDiv.innerHTML = `
        <div class="flex items-center mb-4">
          <i class="${iconClass} text-indigo-600 text-2xl mr-3"></i>
          <h4 class="text-xl font-bold">${feature.category}</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          ${feature.comparison.map(comp => `
            <div>
              <h5 class="font-medium mb-1">${comp.product}</h5>
              <p class="text-gray-700">${comp.details}</p>
            </div>
          `).join('')}
        </div>
        <div class="border-t pt-3">
          <p class="font-medium">Winner: <span class="text-green-600">${feature.winner || 'N/A'}</span></p>
        </div>
      `;
      featuresContainer.appendChild(featureDiv);
    });
  }
  
  function updatePerformanceTab(data) {
    if (!data.performance) return;
    
    // Update chart descriptions
    const descriptions = document.querySelectorAll('#performance .card .mt-4.text-sm.text-gray-600 p');
    if (descriptions.length >= 4 && data.performance.descriptions) {
      for (let i = 0; i < Math.min(descriptions.length, data.performance.descriptions.length); i++) {
        descriptions[i].textContent = data.performance.descriptions[i];
      }
    }
    
    // Update performance analysis
    const analysisContainer = document.querySelector('#performance .card:last-child');
    if (analysisContainer && data.performance.analysis) {
      const generalDesc = analysisContainer.querySelector('p:first-of-type');
      if (generalDesc) {
        generalDesc.textContent = data.performance.analysis.general;
      }
      
      const lists = analysisContainer.querySelectorAll('ul');
      if (lists.length >= 2) {
        // Update product 1 strengths
        const list1 = lists[0];
        list1.innerHTML = '';
        data.performance.analysis.product1Strengths.forEach(strength => {
          const li = document.createElement('li');
          li.textContent = strength;
          list1.appendChild(li);
        });
        
        // Update product 2 strengths
        const list2 = lists[1];
        list2.innerHTML = '';
        data.performance.analysis.product2Strengths.forEach(strength => {
          const li = document.createElement('li');
          li.textContent = strength;
          list2.appendChild(li);
        });
      }
      
      const conclusion = analysisContainer.querySelector('p:last-of-type');
      if (conclusion) {
        conclusion.textContent = data.performance.analysis.conclusion;
      }
    }
  }
  
// Replace the updateCamerasTab function in main.js
function updateCamerasTab(data) {
    console.log("Updating cameras tab with:", data.cameras);
    
    if (!data.cameras) {
        console.warn("No camera data available, generating fallback");
        generateFallbackCameras(data);
        return;
    }
    
    // Update camera specs table
    const specsTable = document.querySelector('#cameras table tbody');
    if (specsTable) {
        specsTable.innerHTML = '';
        data.cameras.specs.forEach(spec => {
            const tr = document.createElement('tr');
            tr.className = 'border-b';
            tr.innerHTML = `
                <td class="py-3 px-4 font-medium">${spec.feature}</td>
                <td class="py-3 px-4">${spec.product1 || '-'}</td>
                <td class="py-3 px-4">${spec.product2 || '-'}</td>
            `;
            specsTable.appendChild(tr);
        });
    }
    
    // Update camera scores
    updateCameraScores(data);
    
    // Update camera samples
    updateCameraSamples(data);
    
    // Update camera analysis
    updateCameraAnalysis(data);
    
    // Update table header product names
    const headerRow = document.querySelector('#cameras table thead tr');
    if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        if (headerCells.length >= 3) {
            headerCells[1].textContent = data.products[0].name;
            headerCells[2].textContent = data.products[1].name;
        }
    }
}

// Helper function to update camera scores
function updateCameraScores(data) {
    const score1 = document.getElementById('camera-score-1');
    const score2 = document.getElementById('camera-score-2');
    
    if (!score1 || !score2) return;
    
    let scores = { product1: 92, product2: 90 };
    if (data.cameras && data.cameras.scores) {
        scores = data.cameras.scores;
    }
    
    score1.textContent = scores.product1;
    score2.textContent = scores.product2;
    
    // Update score bar widths
    const bar1 = score1.closest('.w-full')?.querySelector('.bg-blue-500');
    const bar2 = score2.closest('.w-full')?.querySelector('.bg-green-500');
    
    if (bar1 && bar2) {
        bar1.style.width = `${scores.product1}%`;
        bar2.style.width = `${scores.product2}%`;
    }
}

// Helper function to update camera samples
function updateCameraSamples(data) {
    const samplesContainer = document.getElementById('camera-samples');
    if (!samplesContainer) return;
    
    samplesContainer.innerHTML = '';
    
    const samples = data.cameras?.samples || [
        {
            scenario: "Daylight",
            product1_desc: `${data.products[0].name} produces clear, vibrant images with excellent detail in good lighting.`,
            product2_desc: `${data.products[1].name} offers rich colors and strong contrast in daylight conditions.`
        },
        {
            scenario: "Night",
            product1_desc: `${data.products[0].name} handles low-light situations well with minimal noise.`,
            product2_desc: `${data.products[1].name} captures bright night shots with good detail preservation.`
        }
    ];
    
    samples.forEach(sample => {
        const sampleDiv = document.createElement('div');
        sampleDiv.className = 'card bg-white p-6';
        sampleDiv.innerHTML = `
            <h4 class="text-xl font-bold mb-4">${sample.scenario}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 class="font-medium mb-2">${data.products[0].name}</h5>
                    <img src="${getProductImage(data.products[0].name, sample.scenario)}" alt="${data.products[0].name} - ${sample.scenario}" class="w-full h-48 object-cover rounded mb-2">
                    <p class="text-sm text-gray-700">${sample.product1_desc}</p>
                </div>
                <div>
                    <h5 class="font-medium mb-2">${data.products[1].name}</h5>
                    <img src="${getProductImage(data.products[1].name, sample.scenario)}" alt="${data.products[1].name} - ${sample.scenario}" class="w-full h-48 object-cover rounded mb-2">
                    <p class="text-sm text-gray-700">${sample.product2_desc}</p>
                </div>
            </div>
        `;
        samplesContainer.appendChild(sampleDiv);
    });
}

// Helper function to update camera analysis
function updateCameraAnalysis(data) {
    const analysisContainer = document.getElementById('camera-analysis');
    if (!analysisContainer) return;
    
    const lists = analysisContainer.querySelectorAll('ul');
    if (lists.length < 2) return;
    
    // Default analysis if none provided
    const analysis = data.cameras?.analysis || {
        product1: [
            `Better color accuracy`,
            `Superior video stabilization`,
            `Excellent portrait mode`,
            `Consistent results across lighting conditions`,
            `Natural skin tones`
        ],
        product2: [
            `Higher resolution main sensor`,
            `Better low-light performance`,
            `More shooting modes and options`,
            `Superior zoom capabilities`,
            `AI-enhanced photo processing`
        ],
        recommendation: `If you prioritize video recording and consistent photo quality, choose the ${data.products[0].name}. If you prefer more manual control and creative options, the ${data.products[1].name} might be better suited to your needs.`
    };
    
    // Update product 1 strengths
    const list1 = lists[0];
    list1.innerHTML = '';
    analysis.product1.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        list1.appendChild(li);
    });
    
    // Update product 2 strengths
    const list2 = lists[1];
    list2.innerHTML = '';
    analysis.product2.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        list2.appendChild(li);
    });
    
    const recommendation = analysisContainer.querySelector('p');
    if (recommendation) {
        recommendation.textContent = analysis.recommendation;
    }
}

// Helper function to generate fallback camera data
function generateFallbackCameras(data) {
    if (!data.products || data.products.length < 2) return;
    
    // Create camera data if it doesn't exist
    const product1 = data.products[0].name;
    const product2 = data.products[1].name;
    
    const isApple1 = product1.toLowerCase().includes('iphone') || product1.toLowerCase().includes('apple');
    const isSamsung1 = product1.toLowerCase().includes('samsung') || product1.toLowerCase().includes('galaxy');
    const isPixel1 = product1.toLowerCase().includes('pixel') || product1.toLowerCase().includes('google');
    
    const isApple2 = product2.toLowerCase().includes('iphone') || product2.toLowerCase().includes('apple');
    const isSamsung2 = product2.toLowerCase().includes('samsung') || product2.toLowerCase().includes('galaxy');
    const isPixel2 = product2.toLowerCase().includes('pixel') || product2.toLowerCase().includes('google');
    
    if (!data.cameras) {
        data.cameras = {
            specs: [
                {
                    feature: "Main Camera",
                    product1: isApple1 ? "48MP, f/1.8, OIS" : (isSamsung1 ? "50MP, f/1.8, OIS" : "50MP, f/1.9, OIS"),
                    product2: isApple2 ? "48MP, f/1.8, OIS" : (isSamsung2 ? "50MP, f/1.8, OIS" : "50MP, f/1.9, OIS")
                },
                {
                    feature: "Ultra-wide",
                    product1: isApple1 ? "12MP, f/2.2, 120°" : (isSamsung1 ? "12MP, f/2.2, 120°" : "12MP, f/2.2, 114°"),
                    product2: isApple2 ? "12MP, f/2.2, 120°" : (isSamsung2 ? "12MP, f/2.2, 120°" : "12MP, f/2.2, 114°")
                },
                {
                    feature: "Telephoto",
                    product1: isApple1 ? "12MP, f/2.8, 5x optical zoom" : (isSamsung1 ? "10MP, f/2.4, 3x optical zoom" : "48MP, f/3.5, 5x optical zoom"),
                    product2: isApple2 ? "12MP, f/2.8, 5x optical zoom" : (isSamsung2 ? "10MP, f/2.4, 3x optical zoom" : "48MP, f/3.5, 5x optical zoom")
                },
                {
                    feature: "Selfie Camera",
                    product1: isApple1 ? "12MP, f/1.9, Autofocus" : (isSamsung1 ? "12MP, f/2.2, Autofocus" : "10.8MP, f/2.2, Autofocus"),
                    product2: isApple2 ? "12MP, f/1.9, Autofocus" : (isSamsung2 ? "12MP, f/2.2, Autofocus" : "10.8MP, f/2.2, Autofocus")
                },
                {
                    feature: "Video Recording",
                    product1: isApple1 ? "4K@60fps, 4K Dolby Vision" : (isSamsung1 ? "8K@30fps, 4K@60fps" : "4K@60fps, 10-bit HDR"),
                    product2: isApple2 ? "4K@60fps, 4K Dolby Vision" : (isSamsung2 ? "8K@30fps, 4K@60fps" : "4K@60fps, 10-bit HDR")
                },
                {
                    feature: "Special Features",
                    product1: isApple1 ? "Photographic Styles, ProRAW" : (isSamsung1 ? "Expert RAW, Single Take" : "Magic Eraser, Best Take"),
                    product2: isApple2 ? "Photographic Styles, ProRAW" : (isSamsung2 ? "Expert RAW, Single Take" : "Magic Eraser, Best Take")
                }
            ],
            scores: {
                product1: isApple1 ? 92 : (isSamsung1 ? 90 : 93),
                product2: isApple2 ? 92 : (isSamsung2 ? 90 : 93)
            },
            samples: [
                {
                    scenario: "Daylight",
                    product1_desc: `${product1} produces clear, vibrant images with excellent detail in good lighting.`,
                    product2_desc: `${product2} offers rich colors and strong contrast in daylight conditions.`
                },
                {
                    scenario: "Night",
                    product1_desc: `${product1} handles low-light situations well with minimal noise.`,
                    product2_desc: `${product2} captures bright night shots with good detail preservation.`
                }
            ],
            analysis: {
                product1: [
                    isApple1 ? "Better color accuracy" : "Higher resolution main sensor",
                    isApple1 ? "Superior video stabilization" : "More versatile camera system",
                    isApple1 ? "Excellent portrait mode" : "Enhanced zoom capabilities",
                    "Consistent results across lighting conditions",
                    isApple1 ? "Natural skin tones" : "AI-enhanced photo processing"
                ],
                product2: [
                    isApple2 ? "Better color accuracy" : "Higher resolution main sensor",
                    isApple2 ? "Superior video stabilization" : "More versatile camera system", 
                    isApple2 ? "Excellent portrait mode" : "Enhanced zoom capabilities",
                    "Strong performance in various lighting",
                    isApple2 ? "Natural skin tones" : "AI-enhanced photo processing"
                ],
                recommendation: `If you prioritize ${isApple1 ? "video recording and consistent photo quality" : "resolution and versatility"}, choose the ${product1}. If you prefer ${isApple2 ? "natural colors and reliable results" : "more shooting options and higher resolution"}, the ${product2} might be better suited to your needs.`
            }
        };
    }
    
    // Update the UI with this camera data
    updateCamerasTab(data);
}
  
// Replace the updatePricingTab function in main.js
function updatePricingTab(data) {
    console.log("Updating pricing tab with:", data.pricing);
    
    if (!data.pricing) {
        console.warn("No pricing data available, generating fallback");
        generateFallbackPricing(data);
        return;
    }
    
    // Update product 1 pricing
    updateProductPricing('product1-pricing', data.products[0].name, data.pricing.product1);
    
    // Update product 2 pricing
    updateProductPricing('product2-pricing', data.products[1].name, data.pricing.product2);
    
    // Update pricing container titles
    const pricingContainers = document.querySelectorAll('#pricing h3');
    if (pricingContainers.length >= 2) {
        pricingContainers[0].textContent = `${data.products[0].name} Pricing`;
        pricingContainers[1].textContent = `${data.products[1].name} Pricing`;
    }
}

// Helper function to update a product's pricing section
function updateProductPricing(containerId, productName, pricingData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // If no pricing data provided, create fallback data
    if (!pricingData) {
        pricingData = createFallbackPricing(productName);
    }
    
    container.innerHTML = '';
    
    // Update variants
    const variantsDiv = document.createElement('div');
    variantsDiv.className = 'mb-4';
    variantsDiv.innerHTML = '<h4 class="font-medium mb-2">Variants:</h4>';
    const variantsList = document.createElement('ul');
    variantsList.className = 'list-disc pl-5';
    pricingData.variants.forEach(variant => {
        const li = document.createElement('li');
        li.textContent = `${variant.storage}: ${variant.price}`;
        variantsList.appendChild(li);
    });
    variantsDiv.appendChild(variantsList);
    container.appendChild(variantsDiv);
    
    // Update deals
    const dealsDiv = document.createElement('div');
    dealsDiv.innerHTML = '<h4 class="font-medium mb-2">Current Deals:</h4>';
    const dealsList = document.createElement('ul');
    dealsList.className = 'space-y-2';
    pricingData.deals.forEach(deal => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
            <i class="${getDealIcon(deal.retailer)} text-lg mr-2"></i>
            <span>${deal.retailer}: <strong class="text-green-600">${deal.price}</strong> (Save ${deal.savings})</span>
        `;
        dealsList.appendChild(li);
    });
    dealsDiv.appendChild(dealsList);
    container.appendChild(dealsDiv);
}

// Helper function to create fallback pricing data
function createFallbackPricing(productName) {
    const isApple = productName.toLowerCase().includes('iphone') || productName.toLowerCase().includes('apple');
    const isSamsung = productName.toLowerCase().includes('samsung') || productName.toLowerCase().includes('galaxy');
    
    let basePrice = 799;
    if (isApple) basePrice = 899;
    if (isSamsung) basePrice = 799;
    
    return {
        variants: [
            {storage: "128GB", price: `$${basePrice}`},
            {storage: "256GB", price: `$${basePrice + 100}`},
            {storage: "512GB", price: `$${basePrice + 200}`}
        ],
        deals: [
            {retailer: "Amazon", price: `$${basePrice - 20}`, savings: "$20"},
            {retailer: "Best Buy", price: `$${basePrice - 50}`, savings: "$50 with activation"},
            {retailer: isApple ? "Apple Store" : (isSamsung ? "Samsung.com" : "Manufacturer"), price: `$${basePrice}`, savings: "Full price"}
        ]
    };
}

// Helper function to generate fallback pricing for both products
function generateFallbackPricing(data) {
    if (!data.products || data.products.length < 2) return;
    
    // Create a pricing object if it doesn't exist
    if (!data.pricing) {
        data.pricing = {
            product1: createFallbackPricing(data.products[0].name),
            product2: createFallbackPricing(data.products[1].name)
        };
    }
    
    // Update the UI with this pricing data
    updatePricingTab(data);
}

// Replace the updateReviewsTab function in main.js
function updateReviewsTab(data) {
    console.log("Updating reviews tab with:", data.reviews);
    
    if (!data.reviews) {
        console.warn("No reviews data available, generating fallback");
        generateFallbackReviews(data);
        return;
    }
    
    // Get references to the review containers and update containers titles
    const reviewContainers = document.querySelectorAll('#reviews h4');
    if (reviewContainers.length >= 2) {
        reviewContainers[0].textContent = `${data.products[0].name} Reviews`;
        reviewContainers[1].textContent = `${data.products[1].name} Reviews`;
    }
    
    // Update product 1 reviews
    updateProductReviews('iphone-reviews', data.products[0].name, data.reviews.product1);
    
    // Update product 2 reviews
    updateProductReviews('samsung-reviews', data.products[1].name, data.reviews.product2);
}

// Helper function to update a product's review section
function updateProductReviews(containerId, productName, reviewsData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!reviewsData || reviewsData.length === 0) {
        container.innerHTML = '<p class="text-gray-600">No reviews available for this product.</p>';
        return;
    }
    
    reviewsData.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'border-b pb-4 mb-4';
        reviewDiv.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h5 class="font-medium">${review.source}</h5>
                <div class="star-rating">
                    ${generateStarRating(review.rating)}
                </div>
            </div>
            <p class="text-gray-700">${review.comment}</p>
        `;
        container.appendChild(reviewDiv);
    });
}

// Helper function to generate fallback reviews
function generateFallbackReviews(data) {
    if (!data.products || data.products.length < 2) return;
    
    // Create review data if it doesn't exist
    const product1 = data.products[0].name;
    const product2 = data.products[1].name;
    
    const isApple1 = product1.toLowerCase().includes('iphone') || product1.toLowerCase().includes('apple');
    const isSamsung1 = product1.toLowerCase().includes('samsung') || product1.toLowerCase().includes('galaxy');
    const isPixel1 = product1.toLowerCase().includes('pixel') || product1.toLowerCase().includes('google');
    
    const isApple2 = product2.toLowerCase().includes('iphone') || product2.toLowerCase().includes('apple');
    const isSamsung2 = product2.toLowerCase().includes('samsung') || product2.toLowerCase().includes('galaxy');
    const isPixel2 = product2.toLowerCase().includes('pixel') || product2.toLowerCase().includes('google');
    
    if (!data.reviews) {
        data.reviews = {
            product1: [
                {
                    source: "Tech Radar",
                    rating: isApple1 ? 4.5 : (isSamsung1 ? 4.3 : 4.4),
                    comment: `The ${product1} offers an excellent balance of performance, camera quality, and battery life, making it one of the best options in its class.`
                },
                {
                    source: "CNET",
                    rating: isApple1 ? 4.4 : (isSamsung1 ? 4.2 : 4.5),
                    comment: `With its impressive ${isApple1 ? "ecosystem integration" : (isSamsung1 ? "display" : "AI features")}, the ${product1} stands out in a crowded market of flagship devices.`
                },
                {
                    source: "The Verge",
                    rating: isApple1 ? 4.3 : (isSamsung1 ? 4.4 : 4.3),
                    comment: `Despite its ${isApple1 ? "premium price" : "few quirks"}, the ${product1} delivers a refined experience that will satisfy most users.`
                }
            ],
            product2: [
                {
                    source: "Tech Radar",
                    rating: isApple2 ? 4.5 : (isSamsung2 ? 4.3 : 4.4),
                    comment: `The ${product2} offers an excellent balance of performance, camera quality, and battery life, making it one of the best options in its class.`
                },
                {
                    source: "CNET",
                    rating: isApple2 ? 4.4 : (isSamsung2 ? 4.2 : 4.5),
                    comment: `With its impressive ${isApple2 ? "ecosystem integration" : (isSamsung2 ? "display" : "AI features")}, the ${product2} stands out in a crowded market of flagship devices.`
                },
                {
                    source: "The Verge",
                    rating: isApple2 ? 4.3 : (isSamsung2 ? 4.4 : 4.3),
                    comment: `Despite its ${isApple2 ? "premium price" : "few quirks"}, the ${product2} delivers a refined experience that will satisfy most users.`
                }
            ]
        };
    }
    
    // Update the UI with this reviews data
    updateReviewsTab(data);
}

// Helper function to update a product's review section
function updateProductReviews(containerId, productName, reviewsData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!reviewsData || reviewsData.length === 0) {
        container.innerHTML = '<p class="text-gray-600">No reviews available for this product.</p>';
        return;
    }
    
    reviewsData.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'border-b pb-4 mb-4';
        reviewDiv.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h5 class="font-medium">${review.source}</h5>
                <div class="star-rating">
                    ${generateStarRating(review.rating)}
                </div>
            </div>
            <p class="text-gray-700">${review.comment}</p>
        `;
        container.appendChild(reviewDiv);
    });
}

// Helper function to generate fallback reviews
function generateFallbackReviews(data) {
    if (!data.products || data.products.length < 2) return;
    
    // Create review data if it doesn't exist
    const product1 = data.products[0].name;
    const product2 = data.products[1].name;
    
    const isApple1 = product1.toLowerCase().includes('iphone') || product1.toLowerCase().includes('apple');
    const isSamsung1 = product1.toLowerCase().includes('samsung') || product1.toLowerCase().includes('galaxy');
    const isPixel1 = product1.toLowerCase().includes('pixel') || product1.toLowerCase().includes('google');
    
    const isApple2 = product2.toLowerCase().includes('iphone') || product2.toLowerCase().includes('apple');
    const isSamsung2 = product2.toLowerCase().includes('samsung') || product2.toLowerCase().includes('galaxy');
    const isPixel2 = product2.toLowerCase().includes('pixel') || product2.toLowerCase().includes('google');
    
    if (!data.reviews) {
        data.reviews = {
            product1: [
                {
                    source: "Tech Radar",
                    rating: isApple1 ? 4.5 : (isSamsung1 ? 4.3 : 4.4),
                    comment: `The ${product1} offers an excellent balance of performance, camera quality, and battery life, making it one of the best options in its class.`
                },
                {
                    source: "CNET",
                    rating: isApple1 ? 4.4 : (isSamsung1 ? 4.2 : 4.5),
                    comment: `With its impressive ${isApple1 ? "ecosystem integration" : (isSamsung1 ? "display" : "AI features")}, the ${product1} stands out in a crowded market of flagship devices.`
                },
                {
                    source: "The Verge",
                    rating: isApple1 ? 4.3 : (isSamsung1 ? 4.4 : 4.3),
                    comment: `Despite its ${isApple1 ? "premium price" : "few quirks"}, the ${product1} delivers a refined experience that will satisfy most users.`
                }
            ],
            product2: [
                {
                    source: "Tech Radar",
                    rating: isApple2 ? 4.5 : (isSamsung2 ? 4.3 : 4.4),
                    comment: `The ${product2} offers an excellent balance of performance, camera quality, and battery life, making it one of the best options in its class.`
                },
                {
                    source: "CNET",
                    rating: isApple2 ? 4.4 : (isSamsung2 ? 4.2 : 4.5),
                    comment: `With its impressive ${isApple2 ? "ecosystem integration" : (isSamsung2 ? "display" : "AI features")}, the ${product2} stands out in a crowded market of flagship devices.`
                },
                {
                    source: "The Verge",
                    rating: isApple2 ? 4.3 : (isSamsung2 ? 4.4 : 4.3),
                    comment: `Despite its ${isApple2 ? "premium price" : "few quirks"}, the ${product2} delivers a refined experience that will satisfy most users.`
                }
            ]
        };
    }
    
    // Update the UI with this reviews data
    updateReviewsTab(data);
}

// Replace the updateAIRecommendations function in main.js
function updateAIRecommendations(data) {
    console.log("Updating AI recommendations with:", data.aiRecommendation);
    
    if (!data.aiRecommendation) {
        console.warn("No AI recommendation data available, generating fallback");
        generateSimpleRecommendation(data);
        return;
    }
    
    // Update AI recommendation text
    const aiRecommendation = document.getElementById('ai-recommendation');
    if (aiRecommendation) {
        aiRecommendation.innerHTML = data.aiRecommendation.mainText ||
            "Based on our analysis of both products, we've generated a personalized recommendation for your needs.";
    }
    
    // Update "Perfect for you if" list
    const aiPerfectFor = document.getElementById('ai-perfect-for');
    if (aiPerfectFor) {
        aiPerfectFor.innerHTML = '';
        
        const perfectForItems = data.aiRecommendation.perfectFor || [];
        if (perfectForItems.length === 0) {
            // Fallback items if none provided
            const fallbackItems = [
                `You prioritize the strengths of ${data.products[0].name}`,
                "You want a reliable and well-supported device",
                "You prefer the ecosystem of this brand"
            ];
            perfectForItems.push(...fallbackItems);
        }
        
        perfectForItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            aiPerfectFor.appendChild(li);
        });
    }
    
    // Update "Consider alternatives if" list
    const aiAlternatives = document.getElementById('ai-alternatives');
    if (aiAlternatives) {
        aiAlternatives.innerHTML = '';
        
        const alternativesItems = data.aiRecommendation.alternatives || [];
        if (alternativesItems.length === 0) {
            // Fallback items if none provided
            const fallbackItems = [
                "Budget is your main concern",
                "You need specific features not available in these models",
                "You prefer a different ecosystem"
            ];
            alternativesItems.push(...fallbackItems);
        }
        
        alternativesItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            aiAlternatives.appendChild(li);
        });
    }
}

function generateSimpleRecommendation(data) {
    if (!data.products || data.products.length < 2) return;

    const product1 = data.products[0];
    const product2 = data.products[1];

    // Determine which product has higher rating
    const higherRatedProduct = product1.rating >= product2.rating ? product1 : product2;
    const lowerRatedProduct = product1.rating < product2.rating ? product1 : product2;

    // Generate simple recommendation text
    const recommendationText =
        `<p class="mb-4">Based on the available data, the <strong>${higherRatedProduct.name}</strong> appears to be a strong choice, particularly considering its rating.</p>` +
        `<p>However, your specific needs are important. Consider the detailed specifications and features provided in the other tabs.</p>`;

    // Update recommendation text element
    const aiRecommendationEl = document.getElementById('ai-recommendation');
    if (aiRecommendationEl) {
        aiRecommendationEl.innerHTML = recommendationText;
    }

    // Define very generic fallback list items
    const genericPerfectFor = [
        `You prioritize the strengths of the ${higherRatedProduct.name}.`,
        "Overall value is important.",
        `You prefer the ${higherRatedProduct.name} brand or ecosystem.`
    ];
    const genericAlternatives = [
        `Specific features of the ${lowerRatedProduct.name} are crucial for you.`,
        "Budget is a primary concern.",
        "You are exploring options outside these two models."
    ];

    // Update "Perfect for you if" list element
    const aiPerfectForEl = document.getElementById('ai-perfect-for');
    if (aiPerfectForEl) {
        aiPerfectForEl.innerHTML = ''; // Clear existing items
        genericPerfectFor.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            aiPerfectForEl.appendChild(li);
        });
    }

    // Update "Consider alternatives if" list element
    const aiAlternativesEl = document.getElementById('ai-alternatives');
    if (aiAlternativesEl) {
        aiAlternativesEl.innerHTML = ''; // Clear existing items
        genericAlternatives.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            aiAlternativesEl.appendChild(li);
        });
    }
}

  async function fetchPopularProducts() {
    try {
      const response = await fetch('/api/popular-products');
      const products = await response.json();
      
      // Add popular products to search suggestions
      const datalist = document.getElementById('searchSuggestions');
      if (datalist) {
        datalist.innerHTML = '';
        products.forEach(product => {
          const option = document.createElement('option');
          option.value = product.name;
          datalist.appendChild(option);
        });
      }
      
      // Update popular products section
      const popularContainer = document.getElementById('popular-products');
      if (popularContainer) {
        popularContainer.innerHTML = '';
        products.forEach(product => {
          const card = document.createElement('div');
          card.className = 'card bg-white p-4 text-center';
          card.innerHTML = `
            <img src="${getProductImage(product.name)}" alt="${product.name}" class="w-24 h-24 object-contain mx-auto mb-2">
            <h4 class="font-medium text-sm">${product.name}</h4>
          `;
          card.addEventListener('click', () => {
            searchInput.value = product.name;
            // Optionally trigger search immediately
            // handleSearchClick();
          });
          popularContainer.appendChild(card);
        });
      }
      
    } catch (error) {
      console.error('Error fetching popular products:', error);
    }
  }
  
  function updateBulletList(list, items) {
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
  
  function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star text-yellow-400"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star text-yellow-400"></i>';
    }
    return starsHTML;
  }
  
// Replace the getProductImage function in public/js/main.js
function getProductImage(productName, scenario = 'default') {
    // Lowercase and clean product name for comparison
    const name = productName.toLowerCase().trim();
    const scene = scenario.toLowerCase();
    
    // First try our known product mapping
    const knownProducts = {
        iphone: {
            default: '/images/iphone.png',
            daylight: '/images/iphone-day.jpg',
            night: '/images/iphone-night.jpg'
        },
        galaxy: {
            default: '/images/galaxy.png',
            daylight: '/images/galaxy-day.jpg',
            night: '/images/galaxy-night.jpg'
        },
        pixel: {
            default: '/images/pixel.png',
            daylight: '/images/pixel-day.jpg',
            night: '/images/pixel-night.jpg'
        },
        macbook: {
            default: '/images/macbook.png'
        },
        watch: {
            default: '/images/watch.png'
        }
    };
    
    // Check each known product key to see if it's in the product name
    for (const key in knownProducts) {
        if (name.includes(key)) {
            if (scenario !== 'default' && knownProducts[key][scene]) {
                return knownProducts[key][scene];
            }
            return knownProducts[key].default;
        }
    }

// Helper function to determine product type based on name
function determineProductType(name) {
    if (name.includes('phone') || name.includes('iphone') || name.includes('galaxy') || name.includes('pixel')) {
        return 'phone';
    } else if (name.includes('laptop') || name.includes('book') || name.includes('pad')) {
        return 'laptop';
    } else if (name.includes('watch') || name.includes('band')) {
        return 'watch';
    } else if (name.includes('tablet') || name.includes('tab') || name.includes('pad')) {
        return 'tablet';
    } else if (name.includes('buds') || name.includes('pods') || name.includes('headphone')) {
        return 'audio';
    }
    return 'gadget';
}

// Generate a consistent color based on product name
function generateColorFromName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate background color
    let bg = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        bg += ('00' + value.toString(16)).substr(-2);
    }
    
    // Determine if background is dark or light to set appropriate text color
    const r = parseInt(bg.substr(1, 2), 16);
    const g = parseInt(bg.substr(3, 2), 16);
    const b = parseInt(bg.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return {
        background: bg,
        text: brightness > 128 ? '000000' : 'FFFFFF'
    };
}
    
    // For unknown products, generate a dynamic placeholder image
    const productType = determineProductType(name);
    const brandColor = generateColorFromName(name);
    
    // Use placeholderimage.dev which creates nice dynamic placeholder images
    return `https://placehold.co/400x400/jpg?text=${encodeURIComponent(productName)}&font=montserrat&fontsize=20&bg=${brandColor.background}&textcolor=${brandColor.text}`;
}
  
  function getDealIcon(retailer) {
    const name = retailer.toLowerCase();
    if (name.includes('amazon')) return 'fab fa-amazon text-yellow-500';
    if (name.includes('best buy')) return 'fas fa-store text-blue-600';
    // Add more retailers
    return 'fas fa-tag';
  }
});