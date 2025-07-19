// Dynamic data loading from JSON file
let records = [];
let totalTarget = 19000;

async function loadData() {
  try {
    // Try to load from JSON file first (more reliable)
    const response = await fetch('./content/records.json');
    if (response.ok) {
      const data = await response.json();
      records = data.records;
      totalTarget = data.totalTarget || 19000;
      console.log('Loaded records from JSON:', records);
    } else {
      throw new Error('JSON file not found');
    }
  } catch (error) {
    console.error('Error loading JSON data:', error);
    // Fallback to sample data
    records = getFallbackData();
  }
}

function getFallbackData() {
  return [
    {
      id: 1,
      name: "Ben Botnivick",
      platformsQuit: "Instagram",
      dateQuit: "2024-01-15"
    },
    {
      id: 2,
      name: "Jane Smith", 
      platformsQuit: "Twitter, TikTok",
      dateQuit: "2024-02-03"
    },
    {
      id: 3,
      name: "Mike Johnson",
      platformsQuit: "All platforms",
      dateQuit: "2024-01-28"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      platformsQuit: "Instagram, Snapchat",
      dateQuit: "2024-02-10"
    },
    {
      id: 5,
      name: "David Chen",
      platformsQuit: "Facebook, LinkedIn",
      dateQuit: "2024-01-20"
    }
  ];
}

function loadTableData() {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = ''; // Clear existing data
  
  records.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.id}</td>
      <td>${record.name}</td>
      <td>${record.platformsQuit}</td>
      <td>${record.dateQuit}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateProgressBar() {
  const currentCount = records.length;
  const progressPercentage = (currentCount / totalTarget) * 100;
  
  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }
  
  // Update count display
  const currentCountElement = document.querySelector('.current-count');
  if (currentCountElement) {
    currentCountElement.textContent = currentCount.toLocaleString();
  }
  
  // Update total count
  const totalCountElement = document.querySelector('.total-count');
  if (totalCountElement) {
    totalCountElement.textContent = totalTarget.toLocaleString();
  }
}

// Initialize the page
async function initializePage() {
  await loadData();
  loadTableData();
  updateProgressBar();
}

document.addEventListener('DOMContentLoaded', initializePage);

// Function to add new record (for future use)
function addRecord(name, platformsQuit, dateQuit) {
  const newRecord = {
    id: records.length + 1,
    name,
    platformsQuit,
    dateQuit
  };
  
  records.push(newRecord);
  
  // Reload table and update progress
  loadTableData();
  updateProgressBar();
}

// Function to refresh data (useful for development)
async function refreshData() {
  await loadData();
  loadTableData();
  updateProgressBar();
}

// Make refreshData available globally for testing
window.refreshData = refreshData; 