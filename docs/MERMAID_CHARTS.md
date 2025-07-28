# Attendo - Mermaid Charts

## System Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        LP[Landing Page]
        LM[Login Modal]
        AD[Admin Dashboard]
        TD[Teacher Dashboard]
        SD[Student Dashboard]
        SP[Students Page]
        TP[Teachers Page]
        CP[Classes Page]
        AP[Attendance Page]
        SET[Settings Page]
    end
    
    subgraph "Business Layer"
        AC[Auth Context]
        TC[Theme Context]
        VU[Validation Utils]
        CH[CRUD Hooks]
        AH[Attendance Hooks]
    end
    
    subgraph "Data Layer"
        SS[Student Service]
        TS[Teacher Service]
        CS[Classes Service]
        AS[Attendance Service]
        BS[Base Service]
    end
    
    subgraph "Storage Layer"
        JS[JSON Server]
        LS[Local Storage]
    end
    
    LP --> AC
    LM --> AC
    AD --> CH
    TD --> AH
    SP --> CH
    TP --> CH
    CP --> CH
    AP --> AS
    
    CH --> VU
    AH --> VU
    
    SS --> BS
    TS --> BS
    CS --> BS
    AS --> JS
    BS --> JS
    
    AC --> LS
    TC --> LS
```

## Application Flow

```mermaid
flowchart TD
    START([START]) --> LANDING[Landing Page]
    LANDING --> LOGIN[Login Modal]
    LOGIN --> ROLE{Role Check}
    
    ROLE -->|Admin| ADMIN[Admin Dashboard]
    ROLE -->|Teacher| TEACHER[Teacher Dashboard]
    ROLE -->|Student| STUDENT[Student Dashboard]
    
    ADMIN --> MANAGE[Manage System]
    MANAGE --> STUDENTS[Students Management]
    MANAGE --> TEACHERS[Teachers Management]
    MANAGE --> CLASSES[Classes Management]
    MANAGE --> ATTENDANCE[Attendance Management]
    
    TEACHER --> MYCLASS[View My Class]
    TEACHER --> MARK[Mark Attendance]
    TEACHER --> ANALYTICS[View Analytics]
    
    STUDENT --> MYATTENDANCE[View My Attendance]
    STUDENT --> CLASSINFO[View Class Info]
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Hook
    participant V as Validation
    participant S as Service
    participant API as JSON Server
    participant LS as Local Storage
    
    U->>C: User Action
    C->>H: Call Hook
    H->>V: Validate Data
    V-->>H: Validation Result
    
    alt Valid Data
        H->>S: Service Call
        S->>API: HTTP Request
        API-->>S: Response
        S-->>H: Data
        H-->>C: Update State
        C-->>U: Show Success
    else Invalid Data
        H-->>C: Error Message
        C-->>U: Show Error
    end
    
    Note over LS: Auth & Theme stored locally
```

## Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> LoginModal : Click Login
    LoginModal --> Validating : Submit Credentials
    
    Validating --> AdminDash : Admin Role
    Validating --> TeacherDash : Teacher Role
    Validating --> StudentDash : Student Role
    Validating --> LoginModal : Invalid Credentials
    
    AdminDash --> [*] : Logout
    TeacherDash --> [*] : Logout
    StudentDash --> [*] : Logout
```

## CRUD Operations Flow

```mermaid
flowchart LR
    INPUT[Form Input] --> TRIM[Trim Fields]
    TRIM --> VALIDATE[Validate Data]
    VALIDATE -->|Valid| SERVICE[Service Call]
    VALIDATE -->|Invalid| ERROR[Show Error]
    SERVICE --> UPDATE[Update UI]
    UPDATE --> SUCCESS[Show Success]
    ERROR --> INPUT
```

## Component Hierarchy

```mermaid
graph TD
    APP[App] --> TP[ThemeProvider]
    APP --> AP[AuthProvider]
    APP --> BR[BrowserRouter]
    
    BR --> LP[LandingPage]
    BR --> ML[MainLayout]
    
    LP --> LM[LoginModal]
    
    ML --> AD[AdminPage]
    ML --> TD[TeacherDashboard]
    ML --> SD[StudentDashboard]
    ML --> SP[StudentsPage]
    ML --> TEP[TeachersPage]
    ML --> CP[ClassesPage]
    ML --> ATP[AttendancePage]
    ML --> SET[SettingsPage]
    
    AD --> DS[DashboardStats]
    AD --> AC[AttendanceCharts]
    AD --> DT[DataTable]
    
    SP --> PH[PageHeader]
    SP --> SF[SearchFilter]
    SP --> DT2[DataTable]
    SP --> FD[FormDialog]
    SP --> CD[ConfirmDialog]
```

## Database Schema

```mermaid
erDiagram
    STUDENTS {
        string id PK
        string firstName
        string lastName
        string email UK
        string password
        string rollNumber UK
        datetime createdAt
    }
    
    TEACHERS {
        string id PK
        string firstName
        string lastName
        string email UK
        string password
        datetime createdAt
    }
    
    CLASSES {
        string id PK
        string name UK
        string standard
        string teacherId FK
        array students
        datetime createdAt
    }
    
    ATTENDANCE {
        string id PK
        string classId FK
        string date
        object attendance
        datetime markedAt
    }
    
    TEACHERS ||--o| CLASSES : teaches
    CLASSES ||--o{ STUDENTS : contains
    CLASSES ||--o{ ATTENDANCE : has
```

## User Journey Map

```mermaid
journey
    title User Journey - Admin
    section Login
      Navigate to site: 5: Admin
      Click login: 4: Admin
      Enter credentials: 3: Admin
      Access dashboard: 5: Admin
    section Manage Students
      Go to students page: 5: Admin
      Add new student: 4: Admin
      Assign to class: 4: Admin
      Save changes: 5: Admin
    section Manage Classes
      Go to classes page: 5: Admin
      Create new class: 4: Admin
      Assign teacher: 4: Admin
      View analytics: 5: Admin
```

## State Management

```mermaid
graph LR
    subgraph "Global State"
        AUTH[Auth Context]
        THEME[Theme Context]
    end
    
    subgraph "Local State"
        FORM[Form Data]
        TABLE[Table Data]
        UI[UI State]
    end
    
    subgraph "Derived State"
        FILTERED[Filtered Data]
        STATS[Statistics]
        VALIDATION[Validation State]
    end
    
    AUTH --> FORM
    THEME --> UI
    TABLE --> FILTERED
    TABLE --> STATS
    FORM --> VALIDATION
```