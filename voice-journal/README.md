# Voice Journal - Interactive Daily Journaling App

A modern, interactive journaling application that combines voice-to-text technology, camera mirror functionality, and calendar-based organization to create a comprehensive daily reflection experience.

## ✨ Features

### 🎤 Voice-to-Text Integration
- Real-time speech recognition using Web Speech API
- Continuous voice input with visual feedback
- Support for multiple languages (default: English)
- Fallback to manual text input if voice recognition is unavailable

### 📷 Camera Mirror
- Live camera feed with mirror reflection
- Toggle on/off functionality
- Privacy-focused (no recording or saving of video)
- Responsive design for different screen sizes

### 📅 Calendar System
- Interactive calendar view showing journal entries by date
- Visual indicators for days with entries
- Quick navigation between months
- List view for recent entries
- Click any date to create or view entries

### 💭 Daily Questions
- Curated set of thoughtful daily prompts
- Categories: reflection, gratitude, goals, mood, creativity
- Random selection of 5 questions per day
- Progress tracking through question flow
- Skip functionality for optional questions

### 💾 Data Management
- Local storage for all journal entries
- Export/import functionality for data backup
- Data persistence across browser sessions
- Storage usage tracking

### 📱 Responsive Design
- Mobile-first responsive design
- Touch-friendly interface
- Optimized for both desktop and mobile devices
- Modern, clean UI with Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- Modern web browser with camera and microphone access
- HTTPS connection (required for camera and microphone permissions)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd voice-journal
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Browser Permissions
When you first use the app, your browser will request permissions for:
- **Camera access**: For the mirror functionality
- **Microphone access**: For voice-to-text features

These permissions are required for the full experience but the app will work with limited functionality if denied.

## 🎯 How to Use

### Creating a Journal Entry
1. Click "New Entry" or select a date on the calendar
2. You'll be presented with 5 random daily questions
3. For each question:
   - Type your response in the text area, OR
   - Click the microphone button to use voice input
   - Use the camera mirror to see yourself while reflecting
4. Navigate between questions using Previous/Next buttons
5. Skip questions if desired
6. Complete the entry to save automatically

### Viewing Past Entries
1. Use the calendar view to see which dates have entries (marked with green indicators)
2. Click on any date to view existing entries
3. Switch to list view to see recent entries chronologically

### Data Management
1. Go to Settings to manage your data
2. Export your journal data as a JSON file for backup
3. Import previously exported data
4. View storage statistics

## 🛠️ Technical Details

### Built With
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Web Speech API** for voice recognition
- **WebRTC** for camera access
- **Lucide React** for icons
- **UUID** for unique identifiers

### Browser Compatibility
- Chrome 25+ (recommended)
- Firefox 44+
- Safari 14.1+
- Edge 79+

*Note: Voice recognition works best in Chrome/Chromium-based browsers*

### Data Storage
- All data is stored locally in your browser's localStorage
- No data is sent to external servers
- Data persists until manually cleared or browser data is reset

## 🔒 Privacy & Security

- **No data collection**: All journal entries remain on your device
- **No external APIs**: Voice processing happens entirely in your browser
- **No video recording**: Camera is only used for live mirror view
- **Local storage only**: No cloud sync or external storage

## 🤝 Contributing

This is a personal journaling app, but if you'd like to suggest improvements:
1. Open an issue to discuss proposed changes
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Voice Recognition Not Working
- Ensure microphone permissions are granted
- Try using Chrome or Chromium-based browsers
- Check if your microphone is working in other applications
- Ensure you're on HTTPS (required for microphone access)

### Camera Not Working
- Grant camera permissions when prompted
- Ensure no other applications are using the camera
- Try refreshing the page
- Check browser security settings

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check if you're in incognito/private browsing mode
- Verify browser storage limits haven't been exceeded

## 🌟 Future Enhancements

Potential features for future versions:
- Cloud sync with encryption
- Custom question sets
- Mood tracking with analytics
- Export to different formats (PDF, Word)
- Reminder notifications
- Multi-language support
- Dark mode theme

---

**Happy Journaling! 📖✨**
