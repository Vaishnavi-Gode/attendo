# Attendo - Modern Attendance Tracker

A professional, responsive attendance management system built with React and Material-UI for educational institutions.

## Features

- **Role-Based Access Control**: Admin, Teacher, and Student dashboards
- **Student Management**: Complete CRUD operations for student records
- **Teacher Management**: Manage teacher profiles and assignments
- **Class Management**: Create and organize classes with teacher assignments
- **Attendance Tracking**: Mark and track attendance with visual analytics
- **Dashboard Analytics**: Real-time statistics and charts
- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Local Storage**: All data persisted locally for demo purposes

## Tech Stack

- **React 18** - Modern React with hooks
- **Material-UI v5** - Professional UI components
- **Recharts** - Interactive charts and analytics
- **React Router v6** - Client-side routing
- **React Hot Toast** - Elegant notifications
- **Vite** - Fast build tool and dev server
- **ESLint** - Code quality and consistency

## Project Structure

```
src/
├── components/common/     # Reusable UI components
├── pages/                # Page components for different routes
├── context/              # React Context providers (Auth, Theme)
├── services/             # Data services and API calls
├── hooks/                # Custom React hooks
├── constants/            # Application constants
├── theme/                # Material-UI theme configuration
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:4000`

3. **Build for production**:
   ```bash
   npm run build
   ```

### Default Login Credentials

- **Admin**: admin@example.com / password
- **Teacher**: wilson@example.com / password (or any teacher from dummy data)
- **Student**: john@example.com / password (or any student from dummy data)

## Key Components

### Authentication System
- Role-based login with persistent sessions
- Automatic route protection based on user roles
- Secure logout with session cleanup

### Dashboard Features
- **Admin Dashboard**: Complete system overview with all statistics
- **Teacher Dashboard**: Class-specific attendance and student management
- **Student Dashboard**: Personal attendance records and class information

### Data Management
- Unified storage service for all CRUD operations
- Real-time data synchronization across components
- Dummy data initialization for demo purposes

### Theme System
- Professional light/dark theme implementation
- Consistent color palette and typography
- Responsive design patterns

## Development Guidelines

### Code Organization
- Components are organized by feature and reusability
- Services handle all data operations
- Constants centralize configuration values
- Hooks encapsulate reusable logic

### Styling Approach
- Material-UI theme system for consistent styling
- Responsive design with mobile-first approach
- Custom color palette with professional appearance

### State Management
- React Context for global state (auth, theme)
- Local component state for UI interactions
- Custom hooks for complex state logic

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the established folder structure
2. Use Material-UI components consistently
3. Maintain responsive design patterns
4. Add proper error handling
5. Update documentation for new features

## License

This project is for educational and demonstration purposes.