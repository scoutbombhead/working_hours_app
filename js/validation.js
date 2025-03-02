import { updateSummaryTable } from './summary.js';
// Function to validate each row and update cell styles and Save button state
export function validateTable() {
    const tbody = document.querySelector("#work-hours-table tbody");
    const rows = tbody.querySelectorAll("tr");
    let allFilled = true;
// For each row, check required cells (cells[1] = project, cells[2] = task, cells[3] = hours)
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
// Skip the first cell (the delete button cell)
        for (let i = 1; i < 4; i++) {
            const cell = cells[i];
            // If it's the Hours column, check input value instead of innerText
            if (i === 3) {
                const input = cell.querySelector(".hours-input");
                if (!input || input.value.trim() === "") {  // Ensure the spinner has a valid value
                    cell.classList.add("empty-cell");
                    allFilled = false;
                } else {
                    cell.classList.remove("empty-cell");
                }
            }
            else if (cell.innerText.trim() === "") {
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
    updateSummaryTable();
}

// Update the delete column to match the number of rows
export function updateDeleteButton() {
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

// Remove a row and update the delete column
export function removeRow(rowIndex) {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    if (rowIndex < rows.length) {
        rows[rowIndex].remove();
        updateDeleteButton();
        updateSummaryTable();
        validateTable();
    }
}
