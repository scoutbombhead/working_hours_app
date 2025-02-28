const apiUrl = 'http://localhost:8000/working_hours_app';

async function getWorkHoursTable() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tbody = document.querySelector('#work-hours-table tbody');
    tbody.innerHTML = '';

    data.forEach(entry => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
                <td contenteditable="false"></td>
                <td contenteditable="true">${entry.project}</td>
                <td contenteditable="true">${entry.task}</td>
                <td contenteditable="true">${entry.hours}</td>
            `;
        tbody.appendChild(newRow);
    });

    updateDeleteButton();
    updateSummaryTable();
}
// Update the delete column to match the number of rows
function updateDeleteButton() {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Loop through all rows
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const firstCell = row.querySelector('td'); // Get the first cell of the row

        if (firstCell) {
            // Clear the first cell's content (if any)
            firstCell.innerHTML = '';
            // Add a delete button to all other rows
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.innerText = '-';

            // Attach click handler
            deleteButton.onclick = (function(index) {
                return function() {
                    removeRow(index);
                };
            })(i);

            firstCell.appendChild(deleteButton);
        }
    }
}

// Call the function to populate the delete buttons
updateDeleteButton();
// Remove a row and update the delete column
function removeRow(rowIndex) {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    if (rowIndex < rows.length) {
        rows[rowIndex].remove();
        updateDeleteButton();
        updateSummaryTable();
        validateTable();
    }
}

// Gather table data and update the summary table
function updateSummaryTable() {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    const summary = {}; // Object to accumulate hours per project

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        // Extract project name and hours, trimming any extra spaces.
        if( cells[1].innerText !==''){
            const project = cells[1].innerText.trim();
            const hoursText = cells[3].innerText.trim();
            // Parse hours to a number; if invalid, treat as 0.
            const hours = parseFloat(hoursText) || 0;

            if (project in summary) {
                summary[project] += hours;
            } else {
                summary[project] = hours;
            }
        }
    });

    // Now update the summary table's tbody
    const summaryTbody = document.querySelector('#summary-table tbody');
    summaryTbody.innerHTML = ''; // Clear previous summary

    // For each project, add a new row with the project name and total hours.
    for (const project in summary) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${project}</td>
          <td>${summary[project]}</td>
        `;
        summaryTbody.appendChild(row);
    }
}

// Function to validate each row and update cell styles and Save button state
function validateTable() {
    const tbody = document.querySelector("#work-hours-table tbody");
    const rows = tbody.querySelectorAll("tr");
    let allFilled = true;
// For each row, check required cells (cells[1] = project, cells[2] = task, cells[3] = hours)
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
// Skip the first cell (the delete button cell)
        for (let i = 1; i < 4; i++) {
            const cell = cells[i];
            if (cell.innerText.trim() === "") {
                cell.classList.add("empty-cell");
                console.log("Added empty-cell to:", cell);
                allFilled = false;
            } else {
                cell.classList.remove("empty-cell");
                console.log("Removed empty-cell from:", cell);
            }
        }
    });
// Disable Save Changes button if any required cell is empty
    document.getElementById("save-changes").disabled = !allFilled;
}

// Attach event listeners to table cells to validate on input
function attachCellListeners() {
    document.querySelector("#work-hours-table").addEventListener("input", validateTable);
    document.querySelector("#work-hours-table").addEventListener("keydown", validateTable);
    document.querySelector("#work-hours-table").addEventListener("blur", validateTable, true);

}

// listen to click event on button add entry
// Add a new editable row to the table
document.getElementById('add-entry').addEventListener('click', () => {
    const tbody = document.querySelector('#work-hours-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td contenteditable="false"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
      `;
    tbody.appendChild(newRow);
    validateTable();
    updateDeleteButton();
    updateSummaryTable();
});

// When "Save Changes" is clicked, log table data and update summary.
document.getElementById('save-changes').addEventListener('click', async () => {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    const entries = [];
    //Trim entries of all rows and
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const entry = {
            project: cells[1].innerText.trim(),
            task: cells[2].innerText.trim(),
            hours: cells[3].innerText.trim()
        };
        entries.push(entry);
    });
    console.log('Updated Entries:', entries);
    try {
        const response = await fetch("http://localhost:8000/save_work_hours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entries)
        });

        if (response.ok) {
            alert("Work hours saved successfully!");
        } else {
            alert("Failed to save work hours.");
        }
    } catch (error) {
        console.error("Error saving work hours:", error);
        alert("An error occurred while saving.");
    }
    updateSummaryTable();
    // Optionally, send 'entries' to your FastAPI backend via fetch() here.
});

// Initialize the delete column and summary table on page load.
getWorkHoursTable();
attachCellListeners();