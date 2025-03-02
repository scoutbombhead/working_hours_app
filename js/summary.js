// Gather table data and update the summary table
export function updateSummaryTable() {
    const tbody = document.querySelector('#work-hours-table tbody');
    const rows = tbody.querySelectorAll('tr');
    const summary = {}; // Object to accumulate hours per project

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
}