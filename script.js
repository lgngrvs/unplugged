// Dynamic data loading from MDX file
let records = [];
let totalTarget = 19000;

async function loadData() {
  try {
    // Load from MDX file
    const response = await fetch('./content/records.mdx');
    if (response.ok) {
      const mdxContent = await response.text();
      
      // Parse the MDX content to extract the records array
      const recordsMatch = mdxContent.match(/export const records = (\[[\s\S]*?\]);/);
      
      if (recordsMatch) {
        // Extract the records array string
        let recordsString = recordsMatch[1];
        
        // Clean up the string - remove newlines and extra spaces
        recordsString = recordsString
          .replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Parse the records array - now it's proper JSON format
        try {
          records = JSON.parse(recordsString);
          console.log('Loaded records from MDX:', records);
        } catch (parseError) {
          console.error('Error parsing records from MDX:', parseError);
          records = getFallbackData();
        }
      } else {
        console.error('Could not find records in MDX file');
        records = getFallbackData();
      }
    } else {
      throw new Error('MDX file not found');
    }
  } catch (error) {
    console.error('Error loading MDX data:', error);
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