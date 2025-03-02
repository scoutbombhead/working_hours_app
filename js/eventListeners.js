import { updateDeleteButton } from './validation.js';
import { validateTable } from './validation.js';
import { updateSummaryTable } from './summary.js';

// Attach event listeners to table cells to validate on input
export function attachCellListeners() {
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
        <td><input type="number" class="hours-input" min="0" value=""></td>
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
            hours: cells[3].querySelector(".hours-input").value.trim()
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

document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month-select");
    const workingDays = document.getElementById("working-days");
    const workingHours = document.getElementById("working-hours");
    const sickDays = document.getElementById("sick-days");
    const vacationDays = document.getElementById("vacation-days");

    function getWorkingDays(year, month) {
        let workingDays = 0;
        let totalDays = new Date(year, month, 0).getDate();

        for (let day = 1; day <= totalDays; day++) {
            let date = new Date(year, month - 1, day);
            let dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workingDays++;
            }
        }
        return workingDays;
    }

    monthSelect.addEventListener("change", function () {
        const year = new Date().getFullYear();
        const selectedMonth = parseInt(monthSelect.value);
        workingDays.value = getWorkingDays(year, selectedMonth);
        workingHours.value = parseFloat((parseInt(workingDays.value) * 8.2).toFixed(1));
    });

    // Set default month and working days
    monthSelect.value = new Date().getMonth() + 1;
    monthSelect.dispatchEvent(new Event("change"));

    sickDays.addEventListener("change", function () {
        workingDays.value = getWorkingDays(new Date().getFullYear(), parseInt(monthSelect.value)) - parseInt(sickDays.value) - parseInt(vacationDays.value);
        workingHours.value = parseFloat((parseInt(workingDays.value) * 8.2).toFixed(1));
    });

    vacationDays.addEventListener("change", function () {
        workingDays.value = getWorkingDays(new Date().getFullYear(), parseInt(monthSelect.value)) - parseInt(sickDays.value) - parseInt(vacationDays.value)
        workingHours.value = parseFloat((parseInt(workingDays.value) * 8.2).toFixed(1));
    });

});