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
        const gradeInputs = document.querySelectorAll('.grade-input');
        const subjectNameInputs = document.querySelectorAll('.subject-name-input');
        const unitInputs = document.querySelectorAll('.units-input');

        let totalWeightedGrades = 0;
        let totalUnits = 0;
        let isValid = true;

        for (let i = 0; i < gradeInputs.length; i++) {
            const grade = parseFloat(gradeInputs[i].value);
            const units = parseFloat(unitInputs[i].value);

            const subjectName = subjectNameInputs[i].value.trim() || `Subject ${i + 1}`;

            if (isNaN(grade) || isNaN(units) || units <= 0) {
                resultContainer.textContent = `Error: Please enter valid numbers for "${subjectName}". Units must be positive.`;
                isValid = false;
                break;
            }

            totalWeightedGrades += grade * units;
            totalUnits += units;
        }

        if (isValid) {
            if (totalUnits > 0) {
                const gwa = totalWeightedGrades / totalUnits;
                const honor = getLatinHonor(gwa);
                let messageHTML = '';

                if (honor) {
                    messageHTML = `<br><span class="latin-honor ${honor.className}">${honor.text}</span>`;
                } else if (gwa < 3.0) {
                    messageHTML = `<br><span class="gwa-message"> muntik kana, Keep it up! haha</span>`;
                } else if (gwa === 3.0) {
                    messageHTML = `<br><span class="gwa-message"> safe ka pa ropa, keep it up!</span>`;
                } else if (gwa > 3.0 && gwa < 5.0) {
                    messageHTML = `<br><span class="gwa-message"> bawi next sem, sipag pa sayang baon!</span>`;
                } else if (gwa === 5.0) {
                    messageHTML = `<br><span class="gwa-message"> yari ka kay mommy and daddy! haha</span>`;
                }

                resultContainer.innerHTML = `GWA: <span>${gwa.toFixed(2)}</span>${messageHTML}`;
            } else {
                resultContainer.textContent = 'No units entered. Cannot calculate GWA.';
            }
        }
    });
});
