# Attendo - Architecture & Flow Documentation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Landing   │  │    Login    │  │   Layout    │             │
│  │    Page     │  │   Modal     │  │ Components  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Admin    │  │   Teacher   │  │   Student   │             │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Students   │  │  Teachers   │  │   Classes   │             │
│  │    Page     │  │    Page     │  │    Page     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ Attendance  │  │  Settings   │                               │
│  │    Page     │  │    Page     │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BUSINESS LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Auth     │  │    Theme    │  │ Validation  │             │
│  │   Context   │  │   Context   │  │   Utils     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │    CRUD     │  │ Attendance  │                               │
│  │    Hooks    │  │    Hooks    │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Student   │  │   Teacher   │  │   Classes   │             │
│  │   Service   │  │   Service   │  │   Service   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ Attendance  │  │    Base     │                               │
│  │   Service   │  │   Service   │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       STORAGE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                               │
│  │  JSON Server│  │ Local Storage│                              │
│  │ (Mock API)  │  │ (User/Theme) │                              │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## Application Flow Chart

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Landing Page│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Login Modal │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Role Check  │
                    └──┬───┬───┬──┘
                       │   │   │
            ┌──────────▼┐  │   │
            │   ADMIN   │  │   │
            │ Dashboard │  │   │
            └──────┬────┘  │   │
                   │       │   │
        ┌──────────▼──┐    │   │
        │ Manage:     │    │   │
        │ • Students  │    │   │
        │ • Teachers  │    │   │
        │ • Classes   │    │   │
        │ • Attendance│    │   │
        └─────────────┘    │   │
                           │   │
                ┌──────────▼┐  │
                │  TEACHER  │  │
                │ Dashboard │  │
                └──────┬────┘  │
                       │       │
            ┌──────────▼──┐    │
            │ View:       │    │
            │ • My Class  │    │
            │ • Mark      │    │
            │   Attendance│    │
            │ • Analytics │    │
            └─────────────┘    │
                               │
                    ┌──────────▼┐
                    │  STUDENT  │
                    │ Dashboard │
                    └──────┬────┘
                           │
                ┌──────────▼──┐
                │ View:       │
                │ • My        │
                │   Attendance│
                │ • Class Info│
                └─────────────┘
```

## Data Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    USER     │───▶│   REACT     │───▶│  CONTEXT    │
│ INTERACTION │    │ COMPONENT   │    │ PROVIDERS   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                              │
┌─────────────┐    ┌─────────────┐           │
│ VALIDATION  │◀───│   CUSTOM    │◀──────────┘
│   UTILS     │    │   HOOKS     │
└─────────────┘    └──────┬──────┘
                          │
┌─────────────┐    ┌──────▼──────┐    ┌─────────────┐
│ JSON SERVER │◀───│   SERVICE   │───▶│    LOCAL    │
│  (API MOCK) │    │    LAYER    │    │   STORAGE   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Component Hierarchy

```
App
├── ThemeProvider
├── AuthProvider
├── BrowserRouter
    ├── LandingPage
    │   └── LoginModal
    ├── MainLayout
    │   ├── AdminPage
    │   │   ├── DashboardStats
    │   │   ├── AttendanceCharts
    │   │   └── DataTable
    │   ├── TeacherDashboard
    │   │   ├── DashboardStats
    │   │   ├── AttendanceCharts
    │   │   └── StudentTable
    │   ├── StudentDashboard
    │   │   ├── AttendanceStats
    │   │   └── ClassInfo
    │   ├── StudentsPage
    │   │   ├── PageHeader
    │   │   ├── SearchFilter
    │   │   ├── DataTable
    │   │   ├── FormDialog
    │   │   └── ConfirmDialog
    │   ├── TeachersPage
    │   │   ├── PageHeader
    │   │   ├── SearchFilter
    │   │   ├── DataTable
    │   │   ├── FormDialog
    │   │   └── ConfirmDialog
    │   ├── ClassesPage
    │   │   ├── PageHeader
    │   │   ├── SearchFilter
    │   │   ├── DataTable
    │   │   ├── FormDialog
    │   │   └── ConfirmDialog
    │   ├── AttendancePage
    │   │   ├── ClassSelector
    │   │   ├── DatePicker
    │   │   └── AttendanceTable
    │   └── SettingsPage
    └── ProtectedRoute
```

## Key Features Flow

### Authentication Flow
```
Login → Role Validation → Route Protection → Dashboard Access
```

### CRUD Operations Flow
```
Form Input → Validation → Trim Data → Service Call → Update UI → Show Success
```

### Attendance Flow
```
Select Class → Select Date → Load Students → Mark Attendance → Save → Update Stats
```

### Data Validation Flow
```
User Input → Trim Fields → Check Required → Check Uniqueness → Business Rules → Submit/Error
```

## Technology Stack

- **Frontend**: React 18, Material-UI v5, Vite
- **State Management**: React Context API
- **Routing**: React Router v6
- **Data Fetching**: Fetch API
- **Mock Backend**: JSON Server
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Styling**: Material-UI Theme System