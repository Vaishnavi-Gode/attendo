import { STORAGE_KEYS } from '@constants';

const getFromStorage = (key) => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('storageUpdated', { detail: { key, data } }));
};

const generateId = () => Date.now().toString();

export const studentsService = {
  getAll: () => getFromStorage(STORAGE_KEYS.STUDENTS),
  add: (student) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const newStudent = { ...student, id: generateId() };
    students.push(newStudent);
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  },
  update: (id, updatedStudent) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedStudent };
      saveToStorage(STORAGE_KEYS.STUDENTS, students);
      return students[index];
    }
    return null;
  },
  delete: (id) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const filtered = students.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
    return true;
  }
};

export const teachersService = {
  getAll: () => getFromStorage(STORAGE_KEYS.TEACHERS),
  add: (teacher) => {
    const teachers = getFromStorage(STORAGE_KEYS.TEACHERS);
    const newTeacher = { ...teacher, id: generateId() };
    teachers.push(newTeacher);
    saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
    return newTeacher;
  },
  update: (id, updatedTeacher) => {
    const teachers = getFromStorage(STORAGE_KEYS.TEACHERS);
    const index = teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      teachers[index] = { ...teachers[index], ...updatedTeacher };
      saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
      return teachers[index];
    }
    return null;
  },
  delete: (id) => {
    const teachers = getFromStorage(STORAGE_KEYS.TEACHERS);
    const filtered = teachers.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TEACHERS, filtered);
    return true;
  }
};

export const classesService = {
  getAll: () => getFromStorage(STORAGE_KEYS.CLASSES),
  add: (classData) => {
    const classes = getFromStorage(STORAGE_KEYS.CLASSES);
    const newClass = { ...classData, id: generateId(), students: [], teacherId: null };
    classes.push(newClass);
    saveToStorage(STORAGE_KEYS.CLASSES, classes);
    return newClass;
  },
  update: (id, updatedClass) => {
    const classes = getFromStorage(STORAGE_KEYS.CLASSES);
    const index = classes.findIndex(c => c.id === id);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updatedClass };
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
      return classes[index];
    }
    return null;
  },
  delete: (id) => {
    const classes = getFromStorage(STORAGE_KEYS.CLASSES);
    const filtered = classes.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLASSES, filtered);
    return true;
  },
  assignTeacher: (classId, teacherId) => {
    return classesService.update(classId, { teacherId });
  },
  assignStudent: (classId, studentId) => {
    const classes = getFromStorage(STORAGE_KEYS.CLASSES);
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex !== -1 && !classes[classIndex].students.includes(studentId)) {
      classes[classIndex].students.push(studentId);
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
      return classes[classIndex];
    }
    return null;
  },
  removeStudent: (classId, studentId) => {
    const classes = getFromStorage(STORAGE_KEYS.CLASSES);
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
      classes[classIndex].students = classes[classIndex].students.filter(id => id !== studentId);
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
      return classes[classIndex];
    }
    return null;
  }
};

export const attendanceService = {
  getAll: () => getFromStorage(STORAGE_KEYS.ATTENDANCE),
  mark: (classId, date, attendanceData) => {
    const records = getFromStorage(STORAGE_KEYS.ATTENDANCE);
    const existingIndex = records.findIndex(r => r.classId === classId && r.date === date);
    
    const newRecord = {
      id: existingIndex >= 0 ? records[existingIndex].id : generateId(),
      classId,
      date,
      attendance: attendanceData,
      markedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    saveToStorage(STORAGE_KEYS.ATTENDANCE, records);
    return newRecord;
  },
  getByClassAndDate: (classId, date) => {
    const records = getFromStorage(STORAGE_KEYS.ATTENDANCE);
    return records.find(r => r.classId === classId && r.date === date);
  }
};

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

  saveToStorage(STORAGE_KEYS.STUDENTS, dummyStudents);
  saveToStorage(STORAGE_KEYS.TEACHERS, dummyTeachers);
  saveToStorage(STORAGE_KEYS.CLASSES, dummyClasses);
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (key !== STORAGE_KEYS.USER && key !== STORAGE_KEYS.TOKEN && key !== STORAGE_KEYS.THEME) {
      localStorage.removeItem(key);
    }
  });
};