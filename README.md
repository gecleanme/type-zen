# Type Zen

A typing speed test game built with Vue 3, featuring dynamic quotes and multiple difficulty levels.

## Features

- Real-time typing speed measurement (WPM)
- Accuracy tracking with error counting
- Multiple difficulty levels (easy, medium, hard, expert)
- Dynamic quotes from external API
- Virtual keyboard support
- Dark/light theme toggle
- Local statistics storage
- Sound effects on completion
- Responsive design

## Tech Stack

- Vue 3 with Composition API
- Pinia for state management
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API calls
- VueUse for utilities

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Game Mechanics

- **Easy**: Short quotes (max 50 characters)
- **Medium**: Medium quotes (min 100 characters)
- **Hard**: Long quotes (min 200 characters)
- **Expert**: Very long quotes (min 500 characters)

WPM is calculated using the standard formula: (characters typed / 5) / (time in minutes)

## License 
MIT
