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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
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

  const getSearchOptions = () => {
    switch(searchColumn) {
      case 'name': return classes.map(c => c.name);
      case 'standard': return classes.map(c => c.standard);
      case 'teacher': return classes.map(c => getTeacherName(c.teacherId));
      default: return classes.map(c => [c.name, c.standard, getTeacherName(c.teacherId)]).flat();
    }
  };

  const filteredClasses = classes.filter(classItem => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch(searchColumn) {
      case 'name': return classItem.name.toLowerCase().includes(term);
      case 'standard': return classItem.standard.toLowerCase().includes(term);
      case 'teacher': return getTeacherName(classItem.teacherId).toLowerCase().includes(term);
      default: return classItem.name.toLowerCase().includes(term) ||
                     classItem.standard.toLowerCase().includes(term) ||
                     getTeacherName(classItem.teacherId).toLowerCase().includes(term);
    }
  });

  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Classes</Typography>
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
            Add Class
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
              <option value="name">Class Name</option>
              <option value="standard">Standard</option>
              <option value="teacher">Teacher</option>
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
                <TableCell sx={{ fontWeight: 600 }}>Class Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Standard</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Teacher</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{classItem.name}</TableCell>
                  <TableCell>{classItem.standard}</TableCell>
                  <TableCell>{getTeacherName(classItem.teacherId)}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEdit(classItem)}
                      sx={{ color: '#00ACC1', '&:hover': { background: 'rgba(0,172,193,0.1)' } }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(classItem.id)}
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