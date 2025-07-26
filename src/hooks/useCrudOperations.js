import { useState, useEffect } from 'react';

const useCrudOperations = (service, initialFormData = {}) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const loadData = () => {
    setData(service.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (customLogic) => {
    if (customLogic) {
      customLogic(editing, formData);
    } else {
      if (editing) {
        service.update(editing.id, formData);
      } else {
        service.add(formData);
      }
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

  const confirmDelete = () => {
    service.delete(deleting.id);
    setConfirmOpen(false);
    setDeleting(null);
    loadData();
  };

  const handleAdd = () => {
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
    confirmDelete
  };
};

export default useCrudOperations;