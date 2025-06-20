# Tribute Frontend

A React TypeScript web application designed as a Telegram Mini App for managing tributes and payments.

## Features

- 🚀 **React 18** with TypeScript
- 📱 **Telegram Mini App** integration
- 🎨 **Tailwind CSS** for styling
- 🔄 **React Router** for navigation
- 📦 **Webpack** for bundling
- 🎯 **TypeScript** for type safety
- 🌙 **Dark/Light theme** support
- 📱 **Responsive design**

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout wrapper
├── hooks/              # Custom React hooks
│   └── useTelegram.tsx # Telegram Web App integration
├── pages/              # Page components
│   ├── HomePage.tsx    # Home page
│   └── ProfilePage.tsx # User profile page
├── services/           # API services
│   └── api.ts         # HTTP client and API calls
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared types
├── utils/              # Utility functions
│   └── helpers.ts     # Helper functions
├── App.tsx            # Main app component
├── index.tsx          # App entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run linting (not configured yet)

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Telegram Mini App Integration

This app is designed to run as a Telegram Mini App. Key features:

- **Telegram Web App SDK** integration
- **Theme support** (light/dark mode)
- **User authentication** via Telegram
- **Responsive design** for mobile devices
- **Native Telegram UI** components

### Telegram Web App Features

- User information from Telegram
- Theme colors and parameters
- Main button and back button
- Haptic feedback
- Cloud storage
- Viewport management

## Styling

The app uses **Tailwind CSS** with custom components and utilities:

- **Custom color palette** with Telegram blue
- **Responsive design** for mobile-first approach
- **Dark/light theme** support
- **Custom animations** and transitions
- **Form styling** with @tailwindcss/forms

## API Integration

The app includes a comprehensive API service for:

- User management
- Tribute creation and management
- Data fetching and caching
- Error handling

## TypeScript

Full TypeScript support with:

- **Strict type checking**
- **Path aliases** for clean imports
- **Interface definitions** for all data structures
- **Type-safe API calls**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please refer to the main project documentation or create an issue in the repository. 