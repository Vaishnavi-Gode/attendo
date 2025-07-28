export const validateStudent = (formData, students, editing) => {
  if (!formData.firstName?.trim()) return 'First name is required';
  if (!formData.lastName?.trim()) return 'Last name is required';
  if (!formData.email?.trim()) return 'Email is required';
  if (!formData.password?.trim()) return 'Password is required';
  if (!formData.rollNumber?.trim()) return 'Roll number is required';

  const emailExists = students.find(s => s.email === formData.email && s.id !== editing?.id);
  if (emailExists) return 'Email already exists';

  const rollExists = students.find(s => s.rollNumber === formData.rollNumber && s.id !== editing?.id);
  if (rollExists) return 'Roll number already exists';

  return null;
};

export const validateTeacher = (formData, teachers, classes, editing) => {
  if (!formData.firstName?.trim()) return 'First name is required';
  if (!formData.lastName?.trim()) return 'Last name is required';
  if (!formData.email?.trim()) return 'Email is required';
  if (!formData.password?.trim()) return 'Password is required';

  const emailExists = teachers.find(t => t.email === formData.email && t.id !== editing?.id);
  if (emailExists) return 'Email already exists';

  if (formData.classId) {
    const classAssigned = classes.find(c => c.teacherId && c.teacherId !== editing?.id && c.id === formData.classId);
    if (classAssigned) return 'This class already has a teacher assigned';
  }

  return null;
};

export const validateClass = (formData, classes, editing) => {
  if (!formData.name?.trim()) return 'Class name is required';
  if (!formData.standard?.trim()) return 'Standard is required';

  const nameExists = classes.find(c => 
    c.name === formData.name && 
    c.standard === formData.standard && 
    c.id !== editing?.id
  );
  if (nameExists) return 'Class name already exists for this standard';

  return null;
};

export const validateClassDeletion = (classItem) => {
  if (classItem.teacherId) return 'Cannot delete class with assigned teacher';
  if (classItem.students?.length > 0) return 'Cannot delete class with assigned students';
  return null;
};