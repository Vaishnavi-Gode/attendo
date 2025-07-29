import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  classesService,
  teachersService,
  studentsService,
} from "@services/baseService";
import PageHeader from "@components/common/PageHeader";
import SearchFilter from "@components/common/SearchFilter";
import DataTable from "@components/common/DataTable";
import FormDialog from "@components/common/FormDialog";
import ConfirmDialog from "@components/common/ConfirmDialog";
import useCrudOperations from "@hooks/useCrudOperations";

const ClassesPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const {
    data: classes,
    searchTerm,
    setSearchTerm,
    searchColumn,
    setSearchColumn,
    open,
    setOpen,
    confirmOpen,
    setConfirmOpen,
    editing: editingClass,
    deleting: deletingClass,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete: baseHandleDelete,
    handleAdd,
    confirmDelete,
  } = useCrudOperations(classesService, {
    name: "",
    standard: "",
  }); // CRUD hook with class service

  const handleDelete = (classItem) => {
    if (
      classItem.teacherId ||
      (classItem.students && classItem.students.length > 0)
    ) {
      toast.error(
        "Cannot delete class with assigned teachers or students. Please remove assignments first."
      );
      return;
    }
    baseHandleDelete(classItem);
  };

  //Loading Data
  useEffect(() => {
    const loadData = async () => {
      const [teachersData, studentsData] = await Promise.all([
        teachersService.getAll(),
        studentsService.getAll(),
      ]);
      setTeachers(teachersData);
      setStudents(studentsData);
    };
    loadData();
  }, []);

  const handleFormSubmit = () => {
    if (!formData.name || !formData.standard) {
      toast.error("Please fill in all required fields");
      return;
    }
    handleSubmit();
    toast.success(
      editingClass ? "Class updated successfully!" : "Class added successfully!"
    );
  };

  const getTeacherName = (teacherId) => {
    if (!teachers || teachers.length === 0) return "Loading...";
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher
      ? `${teacher.firstName} ${teacher.lastName}`
      : "Not Assigned";
  };

  const getSearchOptions = () => {
    switch (searchColumn) {
      case "name":
        return classes.map((c) => c.name);
      case "standard":
        return classes.map((c) => c.standard);
      case "teacher":
        return classes.map((c) => getTeacherName(c.teacherId));
      default:
        return classes
          .map((c) => [c.name, c.standard, getTeacherName(c.teacherId)])
          .flat();
    }
  };

  const filteredClasses = classes.filter((classItem) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch (searchColumn) {
      case "name":
        return classItem.name.toLowerCase().includes(term);
      case "standard":
        return classItem.standard.toLowerCase().includes(term);
      case "teacher":
        return getTeacherName(classItem.teacherId).toLowerCase().includes(term);
      default:
        return (
          classItem.name.toLowerCase().includes(term) ||
          classItem.standard.toLowerCase().includes(term) ||
          getTeacherName(classItem.teacherId).toLowerCase().includes(term)
        );
    }
  });

  const columns = [
    { key: "name", label: "Class Name", bold: true },
    { key: "standard", label: "Standard" },
    {
      key: "teacher",
      label: "Teacher",
      render: (row) => getTeacherName(row.teacherId),
    },
  ];

  const columnOptions = [
    { value: "all", label: "All Columns" },
    { value: "name", label: "Class Name" },
    { value: "standard", label: "Standard" },
    { value: "teacher", label: "Teacher" },
  ];

  return (
    <Box>
      <PageHeader title="Classes" onAdd={handleAdd} addButtonText="Add Class" />

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
        data={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editingClass ? "Edit Class" : "Add Class"}
        onSubmit={handleFormSubmit}
        submitText={editingClass ? "Update" : "Add"}
      >
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
            onChange={(e) =>
              setFormData({ ...formData, standard: e.target.value })
            }
            label="Standard"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((std) => (
              <MenuItem
                key={std}
                value={`${std}${
                  std === 1 ? "st" : std === 2 ? "nd" : std === 3 ? "rd" : "th"
                } Standard`}
              >
                {std}
                {std === 1
                  ? "st"
                  : std === 2
                  ? "nd"
                  : std === 3
                  ? "rd"
                  : "th"}{" "}
                Standard
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormDialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Class"
        message={`Are you sure you want to delete ${deletingClass?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default ClassesPage;
