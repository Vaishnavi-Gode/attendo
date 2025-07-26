import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { teachersService, classesService } from '@services/storageService';
import PageHeader from '@components/common/PageHeader';
import SearchFilter from '@components/common/SearchFilter';
import DataTable from '@components/common/DataTable';
import FormDialog from '@components/common/FormDialog';
import ConfirmDialog from '@components/common/ConfirmDialog';
import useCrudOperations from '@hooks/useCrudOperations';

const TeachersPage = () => {
  const [classes, setClasses] = useState([]);
  const {
    data: teachers,
    searchTerm,
    setSearchTerm,
    searchColumn,
    setSearchColumn,
    open,
    confirmOpen,
    editing: editingTeacher,
    deleting: deletingTeacher,
    formData,
    setFormData,
    handleSubmit: baseSubmit,
    handleEdit: baseEdit,
    handleDelete,
    handleAdd,
    confirmDelete
  } = useCrudOperations(teachersService, {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    classId: ''
  });

  useEffect(() => {
    setClasses(classesService.getAll());
  }, []);

  const handleSubmit = () => {
    baseSubmit((editing, formData) => {
      if (editing) {
        teachersService.update(editing.id, formData);
        if (formData.classId) {
          classesService.assignTeacher(formData.classId, editing.id);
        }
      } else {
        const newTeacher = teachersService.add(formData);
        if (formData.classId) {
          classesService.assignTeacher(formData.classId, newTeacher.id);
        }
      }
    });
  };

  const handleEdit = (teacher) => {
    const assignedClass = classes.find(c => c.teacherId === teacher.id);
    baseEdit(teacher, { ...teacher, classId: assignedClass?.id || '' });
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

  const columns = [
    { key: 'name', label: 'Name', bold: true, render: (row) => `${row.firstName} ${row.lastName}` },
    { key: 'email', label: 'Email' },
    { key: 'assignedClass', label: 'Assigned Class', render: (row) => getAssignedClass(row.id) }
  ];

  const columnOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'class', label: 'Assigned Class' }
  ];

  return (
    <Box>
      <PageHeader 
        title="Teachers" 
        onAdd={handleAdd} 
        addButtonText="Add Teacher" 
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
        data={filteredTeachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        onSubmit={handleSubmit}
        submitText={editingTeacher ? 'Update' : 'Add'}
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
        title="Delete Teacher"
        message={`Are you sure you want to delete ${deletingTeacher?.firstName} ${deletingTeacher?.lastName}?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default TeachersPage;