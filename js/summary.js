// Gather table data and update the summary table
export function updateSummaryTable() {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    const summary = {}; // Object to accumulate hours per project
    const totalHours = document.getElementById('total_hours');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        // Extract project name and hours, trimming any extra spaces.
        if( cells[1].innerText !==''){
            const project = cells[1].innerText.trim();
            const hoursText = cells[3].querySelector(".hours-input").value.trim();
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
    updateTotalHours();
}

function updateTotalHours() {
    const summaryTable = document.querySelector("#summary-table tbody");
    const totalHoursInput = document.getElementById("total-hours");

    let total = 0;

    summaryTable.querySelectorAll("tr").forEach(row => {
        const hoursCell = row.querySelector("td:nth-child(2)"); // Select the second column (Total Hours)
        if (hoursCell) {
            total += parseInt(hoursCell.innerText) || 0; // Convert to number, default to 0 if empty
        }
    });

    totalHoursInput.value = total; // Display total with 1 decimal place
}