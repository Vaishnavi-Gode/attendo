import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "@context/AuthContext";
import { USER_ROLE } from "@constants";
import LandingPage from "@pages/LandingPage/LandingPage";
import AdminDashboard from "@pages/Dashboard/AdminPage";
import TeacherDashboard from "@pages/Dashboard/TeacherDashboard";
import StudentDashboard from "@pages/Dashboard/StudentDashboard";
import StudentsPage from "@pages/StudentsPage/StudentsPage";
import TeachersPage from "@pages/TeachersPage/TeachersPage";
import ClassesPage from "@pages/ClassesPage/ClassesPage";
import AttendancePage from "@pages/AttendancePage/AttendancePage";
import SettingsPage from "@pages/SettingsPage/SettingsPage";
import MainLayout from "@components/common/MainLayout";

// Component to protect routes based on user roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); //From AuthContext

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

const AdminLayout = () => (
  <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const TeacherLayout = () => (
  <ProtectedRoute allowedRoles={[USER_ROLE.TEACHER]}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const StudentLayout = () => (
  <ProtectedRoute allowedRoles={[USER_ROLE.STUDENT]}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !user ? (
            <LandingPage />
          ) : user.role === USER_ROLE.ADMIN ? (
            <Navigate to="/admin" replace />
          ) : user.role === USER_ROLE.TEACHER ? (
            <Navigate to="/teacher" replace />
          ) : (
            <Navigate to="/student" replace />
          )
        }
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
      </Route>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
