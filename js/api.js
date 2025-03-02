import { updateDeleteButton } from './validation.js';
import { updateSummaryTable } from './summary.js';

const apiUrl = 'http://localhost:8000/working_hours_app';

export async function getWorkHoursTable() {
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
                <td><input type="number" class="hours-input" min="0" value=${entry.hours}></td>
            `;
        tbody.appendChild(newRow);
    });

    updateDeleteButton();
    updateSummaryTable();
}
