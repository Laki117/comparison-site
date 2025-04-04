// This file handles the chart initializations and updates
// Note: Chart.js is loaded from CDN in the HTML file

// Chart configuration defaults
const chartDefaults = {
  colors: {
    primary: {
      background: 'rgba(59, 130, 246, 0.7)',
      border: 'rgb(59, 130, 246)'
    },
    secondary: {
      background: 'rgba(16, 185, 129, 0.7)',
      border: 'rgb(16, 185, 129)'  
    }
  },
  
  fontFamily: "'Inter', sans-serif"
};

// Function to create benchmark comparison chart
function createBenchmarkChart(ctx, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels || ['Single-Core', 'Multi-Core', 'GPU', 'AnTuTu', 'Geekbench'],
      datasets: [
        {
          label: data.product1Name || 'Product 1',
          data: data.product1Data || [1700, 4800, 14000, 950000, 6200],
          backgroundColor: chartDefaults.colors.primary.background,
          borderColor: chartDefaults.colors.primary.border,
          borderWidth: 1
        },
        {
          label: data.product2Name || 'Product 2',
          data: data.product2Data || [1500, 5200, 12500, 1100000, 5800],
          backgroundColor: chartDefaults.colors.secondary.background,
          borderColor: chartDefaults.colors.secondary.border,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        title: {
          display: true,
          text: 'Benchmark Scores (Higher is Better)',
          font: {
            family: chartDefaults.fontFamily,
            size: 14
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(0) + 'K';
              }
              return value;
            },
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        x: {
          ticks: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        }
      }
    }
  });
}

// Function to create battery life chart
function createBatteryChart(ctx, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels || ['Web Browsing', 'Video Playback', 'Gaming'],
      datasets: [
        {
          label: data.product1Name || 'Product 1',
          data: data.product1Data || [12, 18, 6],
          backgroundColor: chartDefaults.colors.primary.background,
          borderColor: chartDefaults.colors.primary.border,
          borderWidth: 1
        },
        {
          label: data.product2Name || 'Product 2',
          data: data.product2Data || [11, 20, 5],
          backgroundColor: chartDefaults.colors.secondary.background,
          borderColor: chartDefaults.colors.secondary.border,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        title: {
          display: true,
          text: 'Battery Life in Hours (Higher is Better)',
          font: {
            family: chartDefaults.fontFamily,
            size: 14
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        x: {
          ticks: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        }
      }
    }
  });
}

// Function to create display quality radar chart
function createDisplayChart(ctx, data) {
  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: data.labels || ['Brightness', 'Color Accuracy', 'Refresh Rate', 'Resolution', 'HDR Quality'],
      datasets: [
        {
          label: data.product1Name || 'Product 1',
          data: data.product1Data || [90, 95, 85, 88, 92],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: chartDefaults.colors.primary.border,
          borderWidth: 2,
          pointBackgroundColor: chartDefaults.colors.primary.border
        },
        {
          label: data.product2Name || 'Product 2',
          data: data.product2Data || [95, 88, 90, 86, 94],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: chartDefaults.colors.secondary.border,
          borderWidth: 2,
          pointBackgroundColor: chartDefaults.colors.secondary.border
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        title: {
          display: true,
          text: 'Display Quality (Higher is Better)',
          font: {
            family: chartDefaults.fontFamily,
            size: 14
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              family: chartDefaults.fontFamily
            }
          },
          pointLabels: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        }
      }
    }
  });
}

// Function to create real-world performance chart
function createRealWorldChart(ctx, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels || ['App Loading', 'Photo Processing', 'Video Export', 'Web Browsing'],
      datasets: [
        {
          label: data.product1Name || 'Product 1',
          data: data.product1Data || [0.8, 3.2, 15, 0.9],
          backgroundColor: chartDefaults.colors.primary.background,
          borderColor: chartDefaults.colors.primary.border,
          borderWidth: 1
        },
        {
          label: data.product2Name || 'Product 2',
          data: data.product2Data || [1.0, 2.9, 13, 1.1],
          backgroundColor: chartDefaults.colors.secondary.background,
          borderColor: chartDefaults.colors.secondary.border,
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        title: {
          display: true,
          text: 'Task Completion Time in Seconds (Lower is Better)',
          font: {
            family: chartDefaults.fontFamily,
            size: 14
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        },
        y: {
          ticks: {
            font: {
              family: chartDefaults.fontFamily
            }
          }
        }
      }
    }
  });
}

// Export chart functions
window.TechCompareCharts = {
  createBenchmarkChart,
  createBatteryChart,
  createDisplayChart,
  createRealWorldChart,
  updateChartData(chart, data) {
    if (!chart) return;
    
    // Update labels if provided
    if (data.labels) {
      chart.data.labels = data.labels;
    }
    
    // Update dataset labels if provided
    if (data.product1Name) {
      chart.data.datasets[0].label = data.product1Name;
    }
    
    if (data.product2Name) {
      chart.data.datasets[1].label = data.product2Name;
    }
    
    // Update data if provided
    if (data.product1Data) {
      chart.data.datasets[0].data = data.product1Data;
    }
    
    if (data.product2Data) {
      chart.data.datasets[1].data = data.product2Data;
    }
    
    // Refresh chart
    chart.update();
  }
};