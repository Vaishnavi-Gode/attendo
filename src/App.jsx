
import { Box } from '@mui/material';
import { useAuth, USER_ROLE } from '@context/AuthContext';
import LandingPage from '@pages/LandingPage/LandingPage';
import AdminPage from '@pages/AdminPage/AdminPage';
import TeacherPage from '@pages/TeacherPage/TeacherPage';
import StudentPage from '@pages/StudentPage/StudentPage';

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
      return <AdminPage />;
    case USER_ROLE.TEACHER:
      return <TeacherPage />;
    case USER_ROLE.STUDENT:
      return <StudentPage />;
    default:
      return <LandingPage />;
  }
};

export default App;