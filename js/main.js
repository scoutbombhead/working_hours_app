import { getWorkHoursTable } from './api.js';
import { attachCellListeners } from './eventListeners.js';
import { validateTable } from './validation.js';

document.addEventListener("DOMContentLoaded", () => {
    getWorkHoursTable();
    attachCellListeners();
    validateTable();
});
