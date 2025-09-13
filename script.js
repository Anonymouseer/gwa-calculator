document.addEventListener('DOMContentLoaded', () => {
const numSubjectsInput = document.getElementById('num-subjects');
const generateBtn = document.getElementById('generate-fields-btn');
const inputsContainer = document.getElementById('subject-inputs-container');
const actionsSection = document.getElementById('actions-section');
const calculateBtn = document.getElementById('calculate-gwa-btn');
const resultContainer = document.getElementById('result-container');
const resetBtn = document.getElementById('reset-btn');
const shareBtn = document.getElementById('share-btn');
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

    const populateFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        const grades = params.get('grades')?.split(',');
        const units = params.get('units')?.split(',');
        const names = params.get('names')?.split(',');

        if (!grades || !units || grades.length !== units.length) {
            return;
        }

        numSubjectsInput.value = grades.length;
        generateBtn.click();

        const subjectRows = document.querySelectorAll('.subject-row');
        subjectRows.forEach((row, i) => {
            row.querySelector('.grade-input').value = grades[i];
            row.querySelector('.units-input').value = units[i];
            if (names && names[i]) {
                row.querySelector('.subject-name-input').value = names[i];
            }
        });

        calculateBtn.click();
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const handleShare = () => {
        const subjectRows = document.querySelectorAll('.subject-row');
        const data = Array.from(subjectRows).map(row => ({
            name: row.querySelector('.subject-name-input').value,
            grade: row.querySelector('.grade-input').value,
            unit: row.querySelector('.units-input').value
        }));

        const params = new URLSearchParams();
        params.set('names', data.map(d => d.name).join(','));
        params.set('grades', data.map(d => d.grade).join(','));
        params.set('units', data.map(d => d.unit).join(','));

        const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(shareUrl).then(() => alert('Sharable link copied to clipboard!'));
    };

const getLatinHonor = (gwa) => {
        if (gwa >= 1.0 && gwa <= 1.20) {
            return { text: 'Summa Cum Laude Congrats! proud kami sayo!', className: 'summa' };
        } else if (gwa > 1.20 && gwa <= 1.45) {
            return { text: 'Magna Cum Laude Congratulations! proud kami sayo', className: 'magna' };
        } else if (gwa > 1.45 && gwa <= 1.75) {
            return { text: 'Cum Laude, Congratulations! proud kami sayo!', className: 'cum-laude' };
        }
        return null;
    };

    const getGwaMessage = (gwa) => {
        let message = '';
        if (gwa < 3.0 && gwa > 1.75) {
            message = 'pasado ka na sa next level! keep it up!';
        } else if (gwa === 3.0) {
            message = 'safe ka pa ropa, keep it up!';
        } else if (gwa > 3.0 && gwa < 5.0) {
            message = 'bawi next sem, sipag pa sayang baon!';
        } else if (gwa === 5.0) {
            message = 'yari ka kay mommy and daddy! haha';
        }
        return message ? `<br><span class="gwa-message">${message}</span>` : '';
    };

    const createSubjectRow = (index) => {
        const subjectRow = document.createElement('div');
        subjectRow.classList.add('subject-row', 'fade-in');
        subjectRow.innerHTML = `
            <input type="text" class="subject-name-input" placeholder="Subject" aria-label="Subject ${index} Name">
            <div class="subject-inputs">
                <input type="number" class="grade-input" placeholder="Grade" step="0.01" aria-label="Grade for Subject ${index}">
                <input type="number" class="units-input" placeholder="Units" step="0.1" aria-label="Units for Subject ${index}">
            </div>
        `;
        return subjectRow;
    };

generateBtn.addEventListener('click', () => {
        const numSubjects = parseInt(numSubjectsInput.value);
        inputsContainer.innerHTML = '';
        resultContainer.innerHTML = '';

        if (isNaN(numSubjects) || numSubjects <= 0) {
            resultContainer.textContent = 'Please enter a valid number of subjects.';
            actionsSection.classList.add('hidden');
            shareBtn.classList.add('hidden');
            return;
        }

        for (let i = 1; i <= numSubjects; i++) {
            const subjectRow = createSubjectRow(i);
            inputsContainer.appendChild(subjectRow);
        }
        
        actionsSection.classList.remove('hidden');
        shareBtn.classList.add('hidden');
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
                return;
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
            shareBtn.classList.remove('hidden');
        } else {
            resultContainer.textContent = 'No units entered. Cannot calculate GWA.';
            shareBtn.classList.add('hidden');
        }
    });

    resetBtn.addEventListener('click', () => {
        inputsContainer.innerHTML = '';
        resultContainer.innerHTML = '';
        numSubjectsInput.value = '';
        actionsSection.classList.add('hidden');
        shareBtn.classList.add('hidden');
    });

    shareBtn.addEventListener('click', handleShare);

    populateFromURL();
});
