# Attendo - Student Attendance Tracker

A modern, professional student attendance tracking application built with React, JavaScript, and Material-UI.

## Features

- 👥 **Student Management**: Add, edit, delete student records
- 🏫 **Class Management**: Create classes/sections, assign teachers
- ✅ **Attendance Tracking**: Mark attendance with multiple status options
- 📊 **Analytics & Reports**: Visual charts and comprehensive reporting
- 📅 **Calendar Integration**: Calendar view for attendance marking
- 🔐 **Role-Based Access Control**: Admin, Teacher, Student roles
- 🌙 **Dark/Light Mode**: Theme switching capability
- 📱 **Mobile Responsive**: Works on all device sizes
- 🔍 **Search & Filter**: Real-time filtering capabilities
- 📄 **Export Options**: PDF and CSV export functionality

## Tech Stack

- **Frontend**: React 18, JavaScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context + Zustand
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── students/       # Student-related components
│   ├── classes/        # Class management components
│   ├── attendance/     # Attendance components
│   ├── reports/        # Reporting components
│   ├── dashboard/      # Dashboard components
│   └── auth/           # Authentication components
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── theme/              # Material-UI theme configuration
└── assets/             # Static assets
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Development Workflow

The application is designed to be built page by page. Each page will include:

- Responsive layout with Material-UI components
- Form validation and error handling
- API integration with loading states
- Search and filtering capabilities
- Export functionality where applicable
- Role-based access control

## Next Steps

1. Provide your color palette for theme customization
2. Implement individual pages starting with Dashboard
3. Add specific components for each feature
4. Integrate with backend API
5. Add comprehensive testing

## Contributing

Please follow the established folder structure and coding patterns when adding new features.
