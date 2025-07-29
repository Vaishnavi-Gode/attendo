//Reuse to perform operations like add, delete, update in students, teachers, classes

import { useState, useEffect } from "react";

const useCrudOperations = (service, initialFormData = {}) => {
  const [data, setData] = useState([]); //main data
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [open, setOpen] = useState(false); //modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formData, setFormData] = useState(initialFormData); // For form input data, with autofilled values

  const loadData = async () => setData(await service.getAll());

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (customLogic) => {
    if (customLogic) {
      await customLogic(editing, formData);
    } else {
      await service[editing ? "update" : "add"](
        editing?.id || formData,
        editing ? formData : formData
      );
    }
    setOpen(false);
    setEditing(null);
    setFormData(initialFormData);
    loadData();
  };

  const handleEdit = (item, customFormData) => {
    setEditing(item);
    setFormData(customFormData || item);
    setOpen(true);
  };

  const handleDelete = (item) => {
    setDeleting(item);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await service.delete(deleting.id);
    setConfirmOpen(false);
    setDeleting(null);
    loadData();
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData(initialFormData);
    setOpen(true);
  };

  return {
    data,
    searchTerm,
    setSearchTerm,
    searchColumn,
    setSearchColumn,
    open,
    setOpen,
    confirmOpen,
    setConfirmOpen,
    editing,
    deleting,
    formData,
    setFormData,
    loadData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAdd,
    confirmDelete,
  };
};

export default useCrudOperations;
