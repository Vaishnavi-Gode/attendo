import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import toast from 'react-hot-toast';
import { studentsService, classesService } from '@services/storageService';
import PageHeader from '@components/common/PageHeader';
import SearchFilter from '@components/common/SearchFilter';
import DataTable from '@components/common/DataTable';
import FormDialog from '@components/common/FormDialog';
import ConfirmDialog from '@components/common/ConfirmDialog';
import useCrudOperations from '@hooks/useCrudOperations';

const StudentsPage = () => {
  const [classes, setClasses] = useState([]);
  const {
    data: students,
    searchTerm,
    setSearchTerm,
    searchColumn,
    setSearchColumn,
    open,
    setOpen,
    confirmOpen,
    editing: editingStudent,
    deleting: deletingStudent,
    formData,
    setFormData,
    loadData,
    handleSubmit: baseSumbit,
    handleEdit: baseEdit,
    handleDelete,
    handleAdd,
    confirmDelete
  } = useCrudOperations(studentsService, {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rollNumber: '',
    classId: ''
  });

  useEffect(() => {
    loadRelatedData();
    
    const handleStorageUpdate = () => {
      loadRelatedData();
    };
    
    window.addEventListener('storageUpdated', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('storageUpdated', handleStorageUpdate);
    };
  }, []);
  
  const loadRelatedData = async () => {
    setClasses(await classesService.getAll());
  };

  const handleSubmit = () => {
    baseSumbit(async (editing, formData) => {
      if (editing) {
        // Remove from previous class
        const previousClass = classes.find(c => c.students?.includes(editing.id));
        if (previousClass) {
          await classesService.removeStudent(previousClass.id, editing.id);
        }
        
        await studentsService.update(editing.id, formData);
        
        // Assign to new class
        if (formData.classId) {
          await classesService.assignStudent(formData.classId, editing.id);
        }
      } else {
        const newStudent = await studentsService.add(formData);
        if (formData.classId) {
          await classesService.assignStudent(formData.classId, newStudent.id);
        }
      }
    });
    toast.success(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
  };

  const handleEdit = (student) => {
    const assignedClass = classes.find(c => c.students?.includes(student.id));
    baseEdit(student, { ...student, classId: assignedClass?.id || '' });
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

  const columns = [
    { key: 'name', label: 'Name', bold: true, render: (row) => `${row.firstName} ${row.lastName}` },
    { key: 'email', label: 'Email' },
    { key: 'rollNumber', label: 'Roll Number', bold: true },
    { key: 'assignedClass', label: 'Assigned Class', render: (row) => getAssignedClass(row.id) }
  ];

  const columnOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'roll', label: 'Roll Number' }
  ];

  return (
    <Box>
      <PageHeader 
        title="Students" 
        onAdd={handleAdd} 
        addButtonText="Add Student" 
      />
      
      <SearchFilter
        searchColumn={searchColumn}
        setSearchColumn={setSearchColumn}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchOptions={getSearchOptions()}
        columnOptions={columnOptions}
      />
      
      <DataTable
        columns={columns}
        data={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        onSubmit={handleSubmit}
        submitText={editingStudent ? 'Update' : 'Add'}
      >
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
      </FormDialog>
      
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