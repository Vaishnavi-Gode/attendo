import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Edit, Delete, Assignment } from '@mui/icons-material';
import { getStudents, addStudent, updateStudent, deleteStudent, getClasses, assignStudentToClass } from '@services/dataService';
import ConfirmDialog from '@components/common/ConfirmDialog';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rollNumber: '',
    classId: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(getStudents());
    setClasses(getClasses());
  };

  const handleSubmit = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      if (formData.classId) {
        assignStudentToClass(formData.classId, editingStudent.id);
      }
    } else {
      const newStudent = addStudent(formData);
      if (formData.classId) {
        assignStudentToClass(formData.classId, newStudent.id);
      }
    }
    setOpen(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', email: '', password: '', rollNumber: '', classId: '' });
    loadStudents();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    const assignedClass = classes.find(c => c.students?.includes(student.id));
    setFormData({ ...student, classId: assignedClass?.id || '' });
    setOpen(true);
  };

  const handleDelete = (student) => {
    setDeletingStudent(student);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteStudent(deletingStudent.id);
    setConfirmOpen(false);
    setDeletingStudent(null);
    loadStudents();
  };



  const getAssignedClass = (studentId) => {
    const assignedClass = classes.find(c => c.students?.includes(studentId));
    return assignedClass ? `${assignedClass.name} (${assignedClass.standard})` : 'Not Assigned';
  };

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Students</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Student
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Assigned Class</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{getAssignedClass(student.id)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(student)}>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(student)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Roll Number"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign Class (Optional)</InputLabel>
              <Select
                value={formData.classId || ''}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                label="Assign Class (Optional)"
              >
                <MenuItem value="">No Class</MenuItem>
                {classes.map(classItem => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name} - {classItem.standard}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>



        <ConfirmDialog
          open={confirmOpen}
          title="Delete Student"
          message={`Are you sure you want to delete ${deletingStudent?.firstName} ${deletingStudent?.lastName}?`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
    </Box>
  );
};

export default StudentsPage;