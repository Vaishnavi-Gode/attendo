
import { Box } from '@mui/material';
import { useAuth } from '@context/AuthContext';
import { USER_ROLE } from '@constants';
import LandingPage from '@pages/LandingPage/LandingPage';
import AdminDashboard from '@pages/Dashboard/AdminPage';
import TeacherDashboard from '@pages/Dashboard/TeacherDashboard';
import StudentDashboard from '@pages/Dashboard/StudentDashboard';

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

  if (!user) {
    return <LandingPage />;
  }

  // Role-based routing
  switch (user.role) {
    case USER_ROLE.ADMIN:
      return <AdminDashboard />;
    case USER_ROLE.TEACHER:
      return <TeacherDashboard />;
    case USER_ROLE.STUDENT:
      return <StudentDashboard />;
    default:
      return <LandingPage />;
  }
};

export default App;