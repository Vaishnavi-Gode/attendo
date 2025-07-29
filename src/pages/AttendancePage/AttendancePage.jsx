import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import {
  classesService,
  studentsService,
  attendanceService,
} from "@services/baseService";
import { useAuth } from "@context/AuthContext";
import AlertDialog from "@components/common/AlertDialog";

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [classStudents, setClassStudents] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const [allClasses, allStudents] = await Promise.all([
        classesService.getAll(),
        studentsService.getAll(),
      ]);

      // Filter classes based on user role
      if (user?.role === "teacher") {
        const teacherClasses = allClasses.filter(
          (c) => c.teacherId === user.id
        );
        setClasses(teacherClasses);
        // Auto-select teacher's class
        if (teacherClasses.length > 0) {
          setSelectedClass(teacherClasses[0].id);
        }
      } else {
        setClasses(allClasses);
      }

      setStudents(allStudents);
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find((c) => c.id === selectedClass);
      if (classData && classData.students) {
        const studentsInClass = students.filter((s) =>
          classData.students.includes(s.id)
        );
        setClassStudents(studentsInClass);

        // Load existing attendance
        const loadAttendance = async () => {
          const existingAttendance = await attendanceService.getByClassAndDate(
            selectedClass,
            selectedDate
          );
          if (existingAttendance) {
            setAttendance(existingAttendance.attendance);
          } else {
            // Initialize with all present
            const initialAttendance = {};
            studentsInClass.forEach((student) => {
              initialAttendance[student.id] = "present";
            });
            setAttendance(initialAttendance);
          }
        };
        loadAttendance();
      }
    }
  }, [selectedClass, selectedDate, classes, students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      return;
    }

    await attendanceService.mark(selectedClass, selectedDate, attendance);
    setAlertOpen(true);
  };

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mark Attendance
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {user?.role !== "teacher" && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name} - {classItem.standard}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} md={user?.role === "teacher" ? 12 : 6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {selectedClass && classStudents.length > 0 && (
        <Card
          sx={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "20px",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Students ({classStudents.length})
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Mark All Present:
                  </Typography>
                  <Switch
                    checked={Object.values(attendance).every(
                      (status) => status === "present"
                    )}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? "present" : "absent";
                      const newAttendance = {};
                      classStudents.forEach((student) => {
                        newAttendance[student.id] = newStatus;
                      });
                      setAttendance(newAttendance);
                    }}
                    color="success"
                  />
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant={filterStatus === "all" ? "contained" : "outlined"}
                  onClick={() => setFilterStatus("all")}
                  size="small"
                >
                  All
                </Button>
                <Button
                  variant={
                    filterStatus === "present" ? "contained" : "outlined"
                  }
                  onClick={() => setFilterStatus("present")}
                  size="small"
                  color="success"
                >
                  Present
                </Button>
                <Button
                  variant={filterStatus === "absent" ? "contained" : "outlined"}
                  onClick={() => setFilterStatus("absent")}
                  size="small"
                  color="error"
                >
                  Absent
                </Button>
              </Box>
              <Button
                variant="contained"
                onClick={handleSaveAttendance}
                sx={{
                  background:
                    "linear-gradient(135deg, #4dd0e1 0%, #00acc1 100%)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Save Attendance
              </Button>
            </Box>

            <TableContainer
              sx={{
                borderRadius: "12px",
                "& .MuiTableHead-root": {
                  "& .MuiTableCell-root": {
                    background: "rgba(0,96,100,0.8)",
                    fontWeight: 600,
                    borderBottom: "2px solid rgba(0,96,100,0.2)",
                  },
                },
                "& .MuiTableBody-root": {
                  "& .MuiTableRow-root": {
                    "&:nth-of-type(even)": {
                      background: "rgba(255,255,255,0.3)",
                    },
                    "&:hover": {
                      background: "rgba(0,172,193,0.1)",
                    },
                  },
                },
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Roll No.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classStudents
                    .filter((student) => {
                      if (filterStatus === "all") return true;
                      if (filterStatus === "present")
                        return attendance[student.id] === "present";
                      if (filterStatus === "absent")
                        return attendance[student.id] === "absent";
                      return true;
                    })
                    .map((student) => (
                      <TableRow key={student.id}>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {student.rollNumber}
                        </TableCell>
                        <TableCell>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell align="center">
                          {attendance[student.id] === "present" ? (
                            <CheckCircle sx={{ color: "#00ACC1" }} />
                          ) : (
                            <Cancel sx={{ color: "#f44336" }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={attendance[student.id] === "present"}
                            onChange={() => toggleAttendance(student.id)}
                            color="success"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {selectedClass && classStudents.length === 0 && (
        <Card>
          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No students assigned to this class.
            </Typography>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={alertOpen}
        title="Success"
        message="Attendance saved successfully!"
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
};

export default AttendancePage;
