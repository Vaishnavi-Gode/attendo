const STORAGE_KEYS = {
  STUDENTS: 'attendo_students',
  TEACHERS: 'attendo_teachers',
  CLASSES: 'attendo_classes'
};

// Students CRUD
export const getStudents = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
};

export const addStudent = (student) => {
  const students = getStudents();
  const newStudent = { ...student, id: Date.now().toString() };
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (id, updatedStudent) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updatedStudent };
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students[index];
  }
  return null;
};

export const deleteStudent = (id) => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
  return true;
};

// Teachers CRUD
export const getTeachers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]');
};

export const addTeacher = (teacher) => {
  const teachers = getTeachers();
  const newTeacher = { ...teacher, id: Date.now().toString() };
  teachers.push(newTeacher);
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  return newTeacher;
};

export const updateTeacher = (id, updatedTeacher) => {
  const teachers = getTeachers();
  const index = teachers.findIndex(t => t.id === id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...updatedTeacher };
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    return teachers[index];
  }
  return null;
};

export const deleteTeacher = (id) => {
  const teachers = getTeachers();
  const filtered = teachers.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(filtered));
  return true;
};

// Classes CRUD
export const getClasses = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
};

export const addClass = (classData) => {
  const classes = getClasses();
  const newClass = { ...classData, id: Date.now().toString(), students: [], teacherId: null };
  classes.push(newClass);
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  return newClass;
};

export const updateClass = (id, updatedClass) => {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...updatedClass };
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    return classes[index];
  }
  return null;
};

export const deleteClass = (id) => {
  const classes = getClasses();
  const filtered = classes.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(filtered));
  return true;
};

// Assignment functions
export const assignTeacherToClass = (classId, teacherId) => {
  return updateClass(classId, { teacherId });
};

export const assignStudentToClass = (classId, studentId) => {
  const classes = getClasses();
  const classIndex = classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    if (!classes[classIndex].students.includes(studentId)) {
      classes[classIndex].students.push(studentId);
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    }
    return classes[classIndex];
  }
  return null;
};

export const removeStudentFromClass = (classId, studentId) => {
  const classes = getClasses();
  const classIndex = classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    classes[classIndex].students = classes[classIndex].students.filter(id => id !== studentId);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    return classes[classIndex];
  }
  return null;
};

// Initialize dummy data
export const initializeDummyData = () => {
  const dummyStudents = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password', rollNumber: 'S001' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password', rollNumber: 'S002' },
    { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', password: 'password', rollNumber: 'S003' }
  ];

  const dummyTeachers = [
    { id: '1', firstName: 'Prof', lastName: 'Wilson', email: 'wilson@example.com', password: 'password', subject: 'Mathematics' },
    { id: '2', firstName: 'Dr', lastName: 'Brown', email: 'brown@example.com', password: 'password', subject: 'Physics' }
  ];

  const dummyClasses = [
    { id: '1', name: 'Class A', standard: '5th Standard', teacherId: '1', students: ['1', '2'] },
    { id: '2', name: 'Class B', standard: '6th Standard', teacherId: '2', students: ['2', '3'] }
  ];

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(dummyStudents));
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(dummyTeachers));
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(dummyClasses));
};

// Clear all data
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TEACHERS);
  localStorage.removeItem(STORAGE_KEYS.CLASSES);
};