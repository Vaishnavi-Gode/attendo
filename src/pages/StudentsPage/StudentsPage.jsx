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
  InputLabel,
  Autocomplete,
  Grid
} from '@mui/material';
import { Add, Edit, Delete, Assignment } from '@mui/icons-material';
import { getStudents, addStudent, updateStudent, deleteStudent, getClasses, assignStudentToClass } from '@services/dataService';
import ConfirmDialog from '@components/common/ConfirmDialog';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
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

  const getSearchOptions = () => {
    switch(searchColumn) {
      case 'name': return students.map(s => `${s.firstName} ${s.lastName}`);
      case 'email': return students.map(s => s.email);
      case 'roll': return students.map(s => s.rollNumber);
      default: return students.map(s => [`${s.firstName} ${s.lastName}`, s.email, s.rollNumber]).flat();
    }
  };

  const filteredStudents = students.filter(student => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch(searchColumn) {
      case 'name': return `${student.firstName} ${student.lastName}`.toLowerCase().includes(term);
      case 'email': return student.email.toLowerCase().includes(term);
      case 'roll': return student.rollNumber.toLowerCase().includes(term);
      default: return `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
                     student.email.toLowerCase().includes(term) ||
                     student.rollNumber.toLowerCase().includes(term);
    }
  });

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Students</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #4dd0e1 0%, #00acc1 100%)',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Add Student
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Search Column"
              value={searchColumn}
              onChange={(e) => { setSearchColumn(e.target.value); setSearchTerm(''); }}
              SelectProps={{ native: true }}
            >
              <option value="all">All Columns</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="roll">Roll Number</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={8}>
            <Autocomplete
              freeSolo
              options={[...new Set(getSearchOptions())]}
              value={searchTerm}
              onInputChange={(event, newValue) => setSearchTerm(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Search by ${searchColumn === 'all' ? 'any column' : searchColumn}...`}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        <TableContainer sx={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '20px',
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              background: 'rgba(0,96,100,0.8)',
              fontWeight: 600,
              borderBottom: '2px solid rgba(0,96,100,0.2)'
            }
          },
          '& .MuiTableBody-root': {
            '& .MuiTableRow-root': {
              '&:nth-of-type(even)': {
                background: 'rgba(255,255,255,0.3)'
              },
              '&:hover': {
                background: 'rgba(0,172,193,0.1)'
              }
            }
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned Class</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{student.rollNumber}</TableCell>
                  <TableCell>{getAssignedClass(student.id)}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEdit(student)}
                      sx={{ color: '#00ACC1', '&:hover': { background: 'rgba(0,172,193,0.1)' } }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(student)}
                      sx={{ color: '#f44336', '&:hover': { background: 'rgba(244,67,54,0.1)' } }}
                    >
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