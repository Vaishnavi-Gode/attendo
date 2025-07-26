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
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, getClasses, assignTeacherToClass } from '@services/dataService';
import ConfirmDialog from '@components/common/ConfirmDialog';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    classId: ''
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = () => {
    setTeachers(getTeachers());
    setClasses(getClasses());
  };

  const handleSubmit = () => {
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
      if (formData.classId) {
        assignTeacherToClass(formData.classId, editingTeacher.id);
      }
    } else {
      const newTeacher = addTeacher(formData);
      if (formData.classId) {
        assignTeacherToClass(formData.classId, newTeacher.id);
      }
    }
    setOpen(false);
    setEditingTeacher(null);
    setFormData({ firstName: '', lastName: '', email: '', password: '', classId: '' });
    loadTeachers();
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    const assignedClass = classes.find(c => c.teacherId === teacher.id);
    setFormData({ ...teacher, classId: assignedClass?.id || '' });
    setOpen(true);
  };

  const handleDelete = (teacher) => {
    setDeletingTeacher(teacher);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteTeacher(deletingTeacher.id);
    setConfirmOpen(false);
    setDeletingTeacher(null);
    loadTeachers();
  };



  const getAssignedClass = (teacherId) => {
    const assignedClass = classes.find(c => c.teacherId === teacherId);
    return assignedClass ? `${assignedClass.name} (${assignedClass.standard})` : 'Not Assigned';
  };

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Teachers</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Teacher
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Assigned Class</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{getAssignedClass(teacher.id)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(teacher)}>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(teacher)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
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
              {editingTeacher ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>



        <ConfirmDialog
          open={confirmOpen}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${deletingTeacher?.firstName} ${deletingTeacher?.lastName}?`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
    </Box>
  );
};

export default TeachersPage;