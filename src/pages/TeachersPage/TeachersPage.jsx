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
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, getClasses, assignTeacherToClass } from '@services/dataService';
import ConfirmDialog from '@components/common/ConfirmDialog';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
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

  const getSearchOptions = () => {
    switch(searchColumn) {
      case 'name': return teachers.map(t => `${t.firstName} ${t.lastName}`);
      case 'email': return teachers.map(t => t.email);
      case 'class': return teachers.map(t => getAssignedClass(t.id));
      default: return teachers.map(t => [`${t.firstName} ${t.lastName}`, t.email, getAssignedClass(t.id)]).flat();
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch(searchColumn) {
      case 'name': return `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(term);
      case 'email': return teacher.email.toLowerCase().includes(term);
      case 'class': return getAssignedClass(teacher.id).toLowerCase().includes(term);
      default: return `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(term) ||
                     teacher.email.toLowerCase().includes(term) ||
                     getAssignedClass(teacher.id).toLowerCase().includes(term);
    }
  });

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Teachers</Typography>
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
            Add Teacher
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
              <option value="class">Assigned Class</option>
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
                <TableCell sx={{ fontWeight: 600 }}>Assigned Class</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{getAssignedClass(teacher.id)}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEdit(teacher)}
                      sx={{ color: '#00ACC1', '&:hover': { background: 'rgba(0,172,193,0.1)' } }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(teacher)}
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