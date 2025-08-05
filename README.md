# Daily Journal App 📖

A beautiful, interactive web application for daily journaling with thoughtful questions and a calendar-based review system.

## Features

### 🌟 Core Features
- **Daily Questions**: 10 thoughtfully crafted questions to guide your daily reflection
- **Interactive Interface**: Clean, modern design with smooth animations
- **Calendar View**: Visual calendar showing days with journal entries
- **Local Storage**: All data saved locally in your browser
- **Auto-save**: Automatic saving as you type (2-second delay)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 💭 Daily Journal Questions
1. How are you feeling today? What emotions have you experienced?
2. What was the highlight of your day? What made you smile?
3. What challenged you today? How did you handle it?
4. What are you grateful for today?
5. What did you learn about yourself today?
6. How did you show kindness to yourself or others today?
7. What would you like to improve or do differently tomorrow?
8. Describe one meaningful moment from today.
9. What progress did you make toward your goals today?
10. How did you take care of your physical and mental health today?

### 🗓️ Calendar Features
- **Visual Overview**: See all your journal entry dates at a glance
- **Entry Indicators**: Days with entries are highlighted in green
- **Quick Access**: Click on any date to view past entries
- **Month Navigation**: Browse through different months
- **Today Highlight**: Current date is prominently displayed

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or installations required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start journaling immediately!

### File Structure
```
daily-journal/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

### Starting Your Daily Journal
1. **Open the App**: Launch `index.html` in your browser
2. **Today's Date**: The current date is automatically displayed
3. **Answer Questions**: Navigate through the 10 daily questions using the Previous/Next buttons
4. **Write Freely**: Type your thoughts in the text area for each question
5. **Auto-save**: Your answers are automatically saved as you type
6. **Manual Save**: Click the "Save Entry" button for immediate saving

### Navigation
- **Today Button**: Return to today's journal entry
- **Calendar Button**: View the calendar and past entries
- **Question Navigation**: Use Previous/Next buttons to move between questions
- **Keyboard Shortcut**: Press `Ctrl+S` to save your current entry

### Viewing Past Entries
1. Click the **Calendar** button to switch to calendar view
2. Navigate between months using the arrow buttons
3. Days with journal entries are highlighted in green with a small dot
4. Click on any highlighted date to view that day's entries
5. Close the entry viewer by clicking the X button

### Data Storage
- All journal entries are stored locally in your browser
- Data persists between sessions
- No internet connection required
- Your privacy is protected - data never leaves your device

## Features in Detail

### User Interface
- **Modern Design**: Clean, minimalist interface with beautiful gradients
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Elegant transitions and hover effects
- **Typography**: Easy-to-read Inter font family
- **Color Scheme**: Calming blue and purple gradients

### Technical Features
- **Pure JavaScript**: No external frameworks required
- **Local Storage API**: Reliable data persistence
- **Event-driven Architecture**: Responsive user interactions
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Cross-browser Compatibility**: Tested on major browsers

## Customization

### Adding Your Own Questions
Edit the `questions` array in `script.js`:
```javascript
this.questions = [
    "Your custom question here?",
    "Another thoughtful question?",
    // Add more questions...
];
```

### Styling Changes
Modify `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Adding Features
The modular JavaScript structure makes it easy to add:
- Export/import functionality
- Custom question sets
- Mood tracking
- Photo attachments

## Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Privacy & Security
- **Local Only**: All data stored in browser's local storage
- **No Tracking**: No analytics or external connections
- **Private**: Your journal entries never leave your device
- **Secure**: No server-side storage or data transmission

## Tips for Best Experience

### Daily Practice
- Set a specific time each day for journaling
- Find a quiet, comfortable space
- Be honest and authentic in your responses
- Don't worry about grammar or spelling

### Making the Most of Questions
- Take time to really think about each question
- Write as much or as little as feels right
- Use the questions as starting points for deeper reflection
- Revisit past entries to see your growth

## Troubleshooting

### Data Not Saving
- Ensure JavaScript is enabled in your browser
- Check that local storage is not disabled
- Clear browser cache if issues persist

### Display Issues
- Try refreshing the page
- Ensure you're using a supported browser
- Check if browser zoom level is affecting layout

### Performance
- Clear old entries if storage becomes full
- Close other browser tabs to free up memory

## Future Enhancements
- Export entries to PDF or text files
- Custom question templates
- Mood tracking with visual charts
- Photo and media attachments
- Cloud sync options
- Multiple journal support

## Contributing
Feel free to fork this project and submit improvements! Areas for contribution:
- Additional question templates
- New themes and styling options
- Export/backup functionality
- Mobile app version

## License
This project is open source and available under the MIT License.

---

**Happy Journaling! 🌟**

Start your mindfulness journey today with thoughtful daily reflection.