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
import { Add, Edit, Delete } from '@mui/icons-material';
import { 
  getClasses, 
  addClass, 
  updateClass, 
  deleteClass, 
  getTeachers, 
  getStudents
} from '@services/dataService';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    standard: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClasses(getClasses());
    setTeachers(getTeachers());
    setStudents(getStudents());
  };

  const handleSubmit = () => {
    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setOpen(false);
    setEditingClass(null);
    setFormData({ name: '', standard: '' });
    loadData();
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData(classItem);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      deleteClass(id);
      loadData();
    }
  };



  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : '';
  };

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Classes</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Class
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell>Standard</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.standard}</TableCell>
                  <TableCell>{getTeacherName(classItem.teacherId)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(classItem)}>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(classItem.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Class Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingClass ? 'Edit Class' : 'Add Class'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Class Name (e.g., Class A, Class B)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Standard</InputLabel>
              <Select
                value={formData.standard}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                label="Standard"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(std => (
                  <MenuItem key={std} value={`${std}${std === 1 ? 'st' : std === 2 ? 'nd' : std === 3 ? 'rd' : 'th'} Standard`}>
                    {std}{std === 1 ? 'st' : std === 2 ? 'nd' : std === 3 ? 'rd' : 'th'} Standard
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingClass ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>


    </Box>
  );
};

export default ClassesPage;