// Daily Journal App
class DailyJournal {
    constructor() {
        this.currentDate = new Date();
        this.currentQuestionIndex = 0;
        this.currentSection = 'today';
        this.calendarDate = new Date();
        
        // Daily journal questions
        this.questions = [
            "How are you feeling today? What emotions have you experienced?",
            "What was the highlight of your day? What made you smile?",
            "What challenged you today? How did you handle it?",
            "What are you grateful for today?",
            "What did you learn about yourself today?",
            "How did you show kindness to yourself or others today?",
            "What would you like to improve or do differently tomorrow?",
            "Describe one meaningful moment from today.",
            "What progress did you make toward your goals today?",
            "How did you take care of your physical and mental health today?"
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.loadTodaysEntry();
        this.updateQuestion();
        this.showSection('today');
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('todayBtn').addEventListener('click', () => this.showSection('today'));
        document.getElementById('calendarBtn').addEventListener('click', () => this.showSection('calendar'));

        // Question navigation
        document.getElementById('prevQuestionBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestionBtn').addEventListener('click', () => this.nextQuestion());

        // Save entry
        document.getElementById('saveEntryBtn').addEventListener('click', () => this.saveEntry());

        // Calendar navigation
        document.getElementById('prevMonthBtn').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonthBtn').addEventListener('click', () => this.nextMonth());

        // Entry viewer close
        document.getElementById('closeViewerBtn').addEventListener('click', () => this.closeEntryViewer());

        // Auto-save on input
        document.getElementById('journalEntry').addEventListener('input', () => this.autoSave());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveEntry();
            }
        });
    }

    showSection(section) {
        this.currentSection = section;
        
        // Hide all sections
        document.getElementById('todaySection').classList.remove('active');
        document.getElementById('calendarSection').classList.remove('active');

        // Show selected section
        if (section === 'today') {
            document.getElementById('todaySection').classList.add('active');
            document.getElementById('todayBtn').classList.add('btn-primary');
            document.getElementById('todayBtn').classList.remove('btn-secondary');
            document.getElementById('calendarBtn').classList.add('btn-secondary');
            document.getElementById('calendarBtn').classList.remove('btn-primary');
        } else if (section === 'calendar') {
            document.getElementById('calendarSection').classList.add('active');
            document.getElementById('calendarBtn').classList.add('btn-primary');
            document.getElementById('calendarBtn').classList.remove('btn-secondary');
            document.getElementById('todayBtn').classList.add('btn-secondary');
            document.getElementById('todayBtn').classList.remove('btn-primary');
            this.generateCalendar();
        }
    }

    updateCurrentDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            this.currentDate.toLocaleDateString('en-US', options);
    }

    updateQuestion() {
        document.getElementById('currentQuestion').textContent = this.questions[this.currentQuestionIndex];
        document.getElementById('questionProgress').textContent = 
            `${this.currentQuestionIndex + 1} of ${this.questions.length}`;

        // Update button states
        document.getElementById('prevQuestionBtn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextQuestionBtn').disabled = this.currentQuestionIndex === this.questions.length - 1;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.saveCurrentAnswer();
            this.currentQuestionIndex--;
            this.updateQuestion();
            this.loadCurrentAnswer();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.saveCurrentAnswer();
            this.currentQuestionIndex++;
            this.updateQuestion();
            this.loadCurrentAnswer();
        }
    }

    saveCurrentAnswer() {
        const answer = document.getElementById('journalEntry').value;
        const dateKey = this.formatDateKey(this.currentDate);
        const entries = this.getStoredEntries(dateKey) || {};
        entries[this.currentQuestionIndex] = answer;
        localStorage.setItem(`journal_${dateKey}`, JSON.stringify(entries));
    }

    loadCurrentAnswer() {
        const dateKey = this.formatDateKey(this.currentDate);
        const entries = this.getStoredEntries(dateKey) || {};
        const answer = entries[this.currentQuestionIndex] || '';
        document.getElementById('journalEntry').value = answer;
    }

    loadTodaysEntry() {
        this.loadCurrentAnswer();
    }

    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveCurrentAnswer();
            this.showSaveStatus('Auto-saved', 'success');
        }, 2000);
    }

    saveEntry() {
        this.saveCurrentAnswer();
        this.showSaveStatus('Entry saved successfully!', 'success');
        this.showNotification('Journal entry saved!');
    }

    showSaveStatus(message, type) {
        const statusElement = document.getElementById('saveStatus');
        statusElement.textContent = message;
        statusElement.className = `save-status show ${type}`;
        
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 3000);
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    getStoredEntries(dateKey) {
        const stored = localStorage.getItem(`journal_${dateKey}`);
        return stored ? JSON.parse(stored) : null;
    }

    // Calendar functionality
    generateCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const calendarMonth = document.getElementById('calendarMonth');

        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        // Update month header
        calendarMonth.textContent = this.calendarDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear previous calendar
        calendarDays.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            const prevMonthDate = new Date(year, month, 1 - firstDayOfWeek + i);
            dayElement.textContent = prevMonthDate.getDate();
            calendarDays.appendChild(dayElement);
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const currentDate = new Date(year, month, day);
            const dateKey = this.formatDateKey(currentDate);
            const hasEntry = this.getStoredEntries(dateKey) !== null;

            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if it's today
            const today = new Date();
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Check if there's an entry for this day
            if (hasEntry) {
                dayElement.classList.add('has-entry');
                dayElement.addEventListener('click', () => this.viewEntry(currentDate));
            }

            calendarDays.appendChild(dayElement);
        }

        // Add remaining days from next month
        const totalCells = 42; // 6 rows × 7 days
        const cellsUsed = firstDayOfWeek + daysInMonth;
        for (let i = 1; cellsUsed + i - 1 < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = i;
            calendarDays.appendChild(dayElement);
        }
    }

    previousMonth() {
        this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
        this.generateCalendar();
    }

    viewEntry(date) {
        const dateKey = this.formatDateKey(date);
        const entries = this.getStoredEntries(dateKey);

        if (!entries) return;

        const entryViewer = document.getElementById('entryViewer');
        const entryDate = document.getElementById('entryDate');
        const entryContent = document.getElementById('entryContent');

        // Format date
        entryDate.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build content
        let content = '';
        Object.keys(entries).forEach(questionIndex => {
            const answer = entries[questionIndex];
            if (answer && answer.trim()) {
                content += `<h4>${this.questions[questionIndex]}</h4>`;
                content += `<p>${answer}</p>`;
            }
        });

        entryContent.innerHTML = content || '<p>No entries found for this date.</p>';
        entryViewer.classList.add('show');
    }

    closeEntryViewer() {
        document.getElementById('entryViewer').classList.remove('show');
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DailyJournal();
});

// Service Worker Registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}