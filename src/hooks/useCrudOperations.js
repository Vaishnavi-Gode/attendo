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

  const loadData = async () => {
    setData(await service.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when component remounts (page navigation)
  useEffect(() => {
    loadData();
  });

  const handleSubmit = async (customLogic) => {
    if (customLogic) {
      await customLogic(editing, formData);
    } else {
      if (editing) {
        await service.update(editing.id, formData);
      } else {
        await service.add(formData);
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

  const confirmDelete = async () => {
    await service.delete(deleting.id);
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