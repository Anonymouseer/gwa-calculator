document.addEventListener('DOMContentLoaded', () => {
const numSubjectsInput = document.getElementById('num-subjects');
const generateBtn = document.getElementById('generate-fields-btn');
const inputsContainer = document.getElementById('subject-inputs-container');
const calculationSection = document.getElementById('calculation-section');
const calculateBtn = document.getElementById('calculate-gwa-btn');
const resultContainer = document.getElementById('result-container');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const applyTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
        themeToggle.checked = (theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

const getLatinHonor = (gwa) => {
        if (gwa >= 1.0 && gwa <= 1.20) {
            return { text: 'Summa Cum Laude', className: 'summa' };
        } else if (gwa > 1.20 && gwa <= 1.45) {
            return { text: 'Magna Cum Laude', className: 'magna' };
        } else if (gwa > 1.45 && gwa <= 1.75) {
            return { text: 'Cum Laude', className: 'cum-laude' };
        }
        return null;
    };

    const getGwaMessage = (gwa) => {
        let message = '';
        if (gwa < 3.0) {
            message = 'muntik kana, Keep it up! haha';
        } else if (gwa === 3.0) {
            message = 'safe ka pa ropa, keep it up!';
        } else if (gwa > 3.0 && gwa < 5.0) {
            message = 'bawi next sem, sipag pa sayang baon!';
        } else if (gwa === 5.0) {
            message = 'yari ka kay mommy and daddy! haha';
        }
        return message ? `<br><span class="gwa-message">${message}</span>` : '';
    };

generateBtn.addEventListener('click', () => {
        const numSubjects = parseInt(numSubjectsInput.value);
        inputsContainer.innerHTML = '';
        resultContainer.innerHTML = '';

        if (isNaN(numSubjects) || numSubjects <= 0) {
            resultContainer.textContent = 'Please enter a valid number of subjects.';
            calculationSection.classList.add('hidden');
            return;
        }

        for (let i = 1; i <= numSubjects; i++) {
            const subjectRow = document.createElement('div');
            subjectRow.classList.add('subject-row');
            
            subjectRow.innerHTML = `
                <input type="text" class="subject-name-input" placeholder="Subject ${i} Name">
                <div class="subject-inputs">
                    <input type="number" class="grade-input" placeholder="Grade" step="0.01">
                    <input type="number" class="units-input" placeholder="Units" step="0.1">
                </div>
            `;
            inputsContainer.appendChild(subjectRow);
        }
        
        calculationSection.classList.remove('hidden');
    });

calculateBtn.addEventListener('click', () => {
        const subjectRows = document.querySelectorAll('.subject-row');
        let totalWeightedGrades = 0;
        let totalUnits = 0;

        for (let i = 0; i < subjectRows.length; i++) {
            const row = subjectRows[i];
            const gradeInput = row.querySelector('.grade-input');
            const unitInput = row.querySelector('.units-input');
            const subjectNameInput = row.querySelector('.subject-name-input');

            const grade = parseFloat(gradeInput.value);
            const units = parseFloat(unitInput.value);
            const subjectName = subjectNameInput.value.trim() || `Subject ${i + 1}`;

            if (isNaN(grade) || isNaN(units) || units <= 0) {
                resultContainer.textContent = `Error: Please enter valid numbers for "${subjectName}". Units must be positive.`;
                return; // Exit early on validation failure
            }

            totalWeightedGrades += grade * units;
            totalUnits += units;
        }

        if (totalUnits > 0) {
            const gwa = totalWeightedGrades / totalUnits;
            const honor = getLatinHonor(gwa);
            let messageHTML = '';

            if (honor) {
                messageHTML = `<br><span class="latin-honor ${honor.className}">${honor.text}</span>`;
            } else {
                messageHTML = getGwaMessage(gwa);
            }

            resultContainer.innerHTML = `GWA: <span>${gwa.toFixed(2)}</span>${messageHTML}`;
        } else {
            resultContainer.textContent = 'No units entered. Cannot calculate GWA.';
        }
    });
});
