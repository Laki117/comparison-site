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
  function showLoading() {
    loadingOverlay.classList.add('active');
  }
  
  function hideLoading() {
    loadingOverlay.classList.remove('active');
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
      
    } catch (error) {
      console.error('Error during search:', error);
      alert('Failed to generate comparison. Please try again. ' + error.message);
    } finally {
      hideLoading();
    }
  }
  
  function updateComparisonUI(data) {
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
    if (productContainer) {
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
    
    // Update specifications tab
    updateSpecificationsTab(data);
    
    // Update features tab
    updateFeaturesTab(data);
    
    // Update performance tab data
    updatePerformanceTab(data);
    
    // Update cameras tab
    updateCamerasTab(data);
    
    // Update pricing tab
    updatePricingTab(data);
    
    // Update reviews tab
    updateReviewsTab(data);
    
    // Update AI recommendations
    updateAIRecommendations(data);

    
    // Chart updates are handled within updateChartsData
    // Initialize and update the charts with new data
    updateChartsData(data);
  }
  
function updateChartsData(data) {
  // Check if performance data exists and if the charts are initialized
  if (!data.performance) return;
  
  // Destroy existing charts and nullify variables
  if (benchmarkChart) {
    benchmarkChart.destroy();
    benchmarkChart = null; // Explicitly nullify
  }
  if (batteryChart) {
    batteryChart.destroy();
    batteryChart = null; // Explicitly nullify
  }
  if (displayChart) {
    displayChart.destroy();
    displayChart = null; // Explicitly nullify
  }
  if (realWorldChart) {
    realWorldChart.destroy();
    realWorldChart = null; // Explicitly nullify
  }
  
  // Re-initialize charts with new data
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
  
  function updateCamerasTab(data) {
    if (!data.cameras) return;
    
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
    const score1 = document.getElementById('camera-score-1');
    const score2 = document.getElementById('camera-score-2');
    if (score1 && score2 && data.cameras.scores) {
      score1.textContent = data.cameras.scores.product1;
      score2.textContent = data.cameras.scores.product2;
      
      // Update score bar widths
      const bar1 = score1.closest('.w-full').querySelector('.bg-blue-500');
      const bar2 = score2.closest('.w-full').querySelector('.bg-green-500');
      if (bar1 && bar2) {
        bar1.style.width = `${data.cameras.scores.product1}%`;
        bar2.style.width = `${data.cameras.scores.product2}%`;
      }
    }
    
    // Update camera samples
    const samplesContainer = document.getElementById('camera-samples');
    if (samplesContainer && data.cameras.samples) {
      samplesContainer.innerHTML = '';
      data.cameras.samples.forEach(sample => {
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
    
    // Update camera analysis
    const analysisContainer = document.getElementById('camera-analysis');
    if (analysisContainer && data.cameras.analysis) {
      const lists = analysisContainer.querySelectorAll('ul');
      if (lists.length >= 2) {
        // Update product 1 strengths
        const list1 = lists[0];
        list1.innerHTML = '';
        data.cameras.analysis.product1.forEach(strength => {
          const li = document.createElement('li');
          li.textContent = strength;
          list1.appendChild(li);
        });
        
        // Update product 2 strengths
        const list2 = lists[1];
        list2.innerHTML = '';
        data.cameras.analysis.product2.forEach(strength => {
          const li = document.createElement('li');
          li.textContent = strength;
          list2.appendChild(li);
        });
      }
      
      const recommendation = analysisContainer.querySelector('p');
      if (recommendation) {
        recommendation.textContent = data.cameras.analysis.recommendation;
      }
    }
  }
  
  function updatePricingTab(data) {
    if (!data.pricing) return;
    
    // Update product 1 pricing
    const product1Pricing = document.getElementById('product1-pricing');
    if (product1Pricing && data.pricing.product1) {
      product1Pricing.innerHTML = '';
      
      // Update variants
      const variantsDiv = document.createElement('div');
      variantsDiv.className = 'mb-4';
      variantsDiv.innerHTML = '<h4 class="font-medium mb-2">Variants:</h4>';
      const variantsList = document.createElement('ul');
      variantsList.className = 'list-disc pl-5';
      data.pricing.product1.variants.forEach(variant => {
        const li = document.createElement('li');
        li.textContent = `${variant.storage}: ${variant.price}`;
        variantsList.appendChild(li);
      });
      variantsDiv.appendChild(variantsList);
      product1Pricing.appendChild(variantsDiv);
      
      // Update deals
      const dealsDiv = document.createElement('div');
      dealsDiv.innerHTML = '<h4 class="font-medium mb-2">Current Deals:</h4>';
      const dealsList = document.createElement('ul');
      dealsList.className = 'space-y-2';
      data.pricing.product1.deals.forEach(deal => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
          <i class="${getDealIcon(deal.retailer)} text-lg mr-2"></i>
          <span>${deal.retailer}: <strong class="text-green-600">${deal.price}</strong> (Save ${deal.savings})</span>
        `;
        dealsList.appendChild(li);
      });
      dealsDiv.appendChild(dealsList);
      product1Pricing.appendChild(dealsDiv);
    }
    
    // Update product 2 pricing
    const product2Pricing = document.getElementById('product2-pricing');
    if (product2Pricing && data.pricing.product2) {
      product2Pricing.innerHTML = '';
      
      // Update variants
      const variantsDiv = document.createElement('div');
      variantsDiv.className = 'mb-4';
      variantsDiv.innerHTML = '<h4 class="font-medium mb-2">Variants:</h4>';
      const variantsList = document.createElement('ul');
      variantsList.className = 'list-disc pl-5';
      data.pricing.product2.variants.forEach(variant => {
        const li = document.createElement('li');
        li.textContent = `${variant.storage}: ${variant.price}`;
        variantsList.appendChild(li);
      });
      variantsDiv.appendChild(variantsList);
      product2Pricing.appendChild(variantsDiv);
      
      // Update deals
      const dealsDiv = document.createElement('div');
      dealsDiv.innerHTML = '<h4 class="font-medium mb-2">Current Deals:</h4>';
      const dealsList = document.createElement('ul');
      dealsList.className = 'space-y-2';
      data.pricing.product2.deals.forEach(deal => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
          <i class="${getDealIcon(deal.retailer)} text-lg mr-2"></i>
          <span>${deal.retailer}: <strong class="text-green-600">${deal.price}</strong> (Save ${deal.savings})</span>
        `;
        dealsList.appendChild(li);
      });
      dealsDiv.appendChild(dealsList);
      product2Pricing.appendChild(dealsDiv);
    }
    
    // Update pricing container titles
    const pricingContainers = document.querySelectorAll('#pricing h3');
    if (pricingContainers.length >= 2) {
      pricingContainers[0].textContent = `${data.products[0].name} Pricing`;
      pricingContainers[1].textContent = `${data.products[1].name} Pricing`;
    }
  }

function updateReviewsTab(data) {
  if (!data.reviews) return;
  
  // Get references to the review containers
  const product1Reviews = document.getElementById('iphone-reviews');
  const product2Reviews = document.getElementById('samsung-reviews');
  
  // Update review container titles
  const reviewContainers = document.querySelectorAll('#reviews h4');
  if (reviewContainers.length >= 2) {
    reviewContainers[0].textContent = `${data.products[0].name} Reviews`;
    reviewContainers[1].textContent = `${data.products[1].name} Reviews`;
  }
  
  // Update product 1 reviews
  if (product1Reviews) {
    product1Reviews.innerHTML = '';
    
    if (data.reviews.product1 && data.reviews.product1.length > 0) {
      data.reviews.product1.forEach(review => {
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
        product1Reviews.appendChild(reviewDiv);
      });
    } else {
      product1Reviews.innerHTML = '<p class="text-gray-600">No reviews available for this product.</p>';
    }
  }
  
  // Update product 2 reviews
  if (product2Reviews) {
    product2Reviews.innerHTML = '';
    
    if (data.reviews.product2 && data.reviews.product2.length > 0) {
      data.reviews.product2.forEach(review => {
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
        product2Reviews.appendChild(reviewDiv);
      });
    } else {
      product2Reviews.innerHTML = '<p class="text-gray-600">No reviews available for this product.</p>';
    }
  }
}

function updateAIRecommendations(data) {
  if (!data.aiRecommendation) {
    // If AI recommendation is not provided, generate a simple one based on comparison data
    generateSimpleRecommendation(data);
    return;
  }
  
  // Update AI recommendation text
  const aiRecommendation = document.getElementById('ai-recommendation');
  if (aiRecommendation) {
    aiRecommendation.innerHTML = data.aiRecommendation.mainText;
  }
  
  // Update "Perfect for you if" list
  const aiPerfectFor = document.getElementById('ai-perfect-for');
  if (aiPerfectFor) {
    aiPerfectFor.innerHTML = '';
    data.aiRecommendation.perfectFor.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      aiPerfectFor.appendChild(li);
    });
  }
  
  // Update "Consider alternatives if" list
  const aiAlternatives = document.getElementById('ai-alternatives');
  if (aiAlternatives) {
    aiAlternatives.innerHTML = '';
    data.aiRecommendation.alternatives.forEach(item => {
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
  
  // Generate simple recommendation - Note: Using string concatenation to avoid potential template literal issues in tool
  const recommendationText = 
    '<p class=\"mb-4\">Based on the detailed comparison between ' + product1.name + ' and ' + product2.name + ', our AI analysis suggests that <strong>' + higherRatedProduct.name + '</strong> would be the better choice for most users.</p>' +
    '<p>The ' + higherRatedProduct.name + ' provides excellent value with its combination of features, performance, and price point. However, your specific needs may vary, so consider the key differences highlighted in our comparison.</p>';
  
  // Update recommendation text
  const aiRecommendation = document.getElementById('ai-recommendation');
  if (aiRecommendation) {
    aiRecommendation.innerHTML = recommendationText;
  }
  
  // Generate strengths and weaknesses based on features
  let perfectForItems = [];
  let alternativesItems = [];
  
  if (data.features && data.features.length > 0) {
    const featuresWonByProduct1 = data.features.filter(feature => 
      feature.winner && feature.winner.includes(product1.name)
    );
    
    const featuresWonByProduct2 = data.features.filter(feature => 
      feature.winner && feature.winner.includes(product2.name)
    );
    
    if (higherRatedProduct.name === product1.name) {
      perfectForItems = featuresWonByProduct1.map(feature => 'You value ' + feature.category.toLowerCase() + ' quality');
      alternativesItems = featuresWonByProduct2.map(feature => feature.category + ' is your top priority');
    } else {
      perfectForItems = featuresWonByProduct2.map(feature => 'You value ' + feature.category.toLowerCase() + ' quality');
      alternativesItems = featuresWonByProduct1.map(feature => feature.category + ' is your top priority');
    }
  }
  
  // Add price consideration
  perfectForItems.push('Your budget is around ' + higherRatedProduct.price);
  
  // Limit to 3 items
  perfectForItems = perfectForItems.slice(0, 3);
  alternativesItems = alternativesItems.slice(0, 3);
  
  // Update lists
  const aiPerfectFor = document.getElementById('ai-perfect-for');
  if (aiPerfectFor) {
    aiPerfectFor.innerHTML = '';
    perfectForItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      aiPerfectFor.appendChild(li);
    });
  }
  
  const aiAlternatives = document.getElementById('ai-alternatives');
  if (aiAlternatives) {
    aiAlternatives.innerHTML = '';
    alternativesItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      aiAlternatives.appendChild(li);
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
  
  function getProductImage(productName, scenario = 'default') {
    const name = productName.toLowerCase();
    const scene = scenario.toLowerCase();
    
    // Basic mapping - expand as needed
    if (name.includes('iphone 16')) {
      if (scene === 'daylight') return '/images/iphone16-day.jpg';
      if (scene === 'night') return '/images/iphone16-night.jpg';
      return '/images/iphone16.png';
    }
    if (name.includes('samsung galaxy s24')) {
      if (scene === 'daylight') return '/images/s24-day.jpg';
      if (scene === 'night') return '/images/s24-night.jpg';
      return '/images/s24.png';
    }
    // Add more product images here
    
    // Fallback image
    return '/images/placeholder.png';
  }
  
  function getDealIcon(retailer) {
    const name = retailer.toLowerCase();
    if (name.includes('amazon')) return 'fab fa-amazon text-yellow-500';
    if (name.includes('best buy')) return 'fas fa-store text-blue-600';
    // Add more retailers
    return 'fas fa-tag';
  }
});