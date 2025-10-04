# PR Jewellers - E-commerce Website

PR Jewellers is a modern e-commerce website built with React, Vite, Redux, and TailwindCSS. The application showcases jewelry products, provides real-time gold and silver price updates, and offers a seamless shopping experience.

## Features

- **Real-time Metal Price Updates**: Live gold and silver price tracking via WebSocket connection
- **Product Catalog**: Browse jewelry products by categories
- **Responsive Design**: Optimized for all device sizes using TailwindCSS
- **Admin Panel**: Secure admin interface for product management
- **Contact Form**: Customer inquiry submission with Mailgun integration
- **State Management**: Centralized state management with Redux and Redux Saga

## Tech Stack

- **Frontend**: React 18, React Router v7
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS, PostCSS
- **State Management**: Redux Toolkit, Redux Saga
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast
- **Code Quality**: ESLint

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:pr-j23/pr-jewellers.git
   cd pr-jewellers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready app
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
pr-jewellers/
├── public/              # Static assets
├── src/
│   ├── api/             # API integration
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── mockData/        # Mock data for development
│   ├── pages/           # Page components
│   ├── redux/           # Redux store, reducers, sagas
│   ├── services/        # Service layer for API calls
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # TailwindCSS configuration
└── vite.config.js       # Vite configuration
```