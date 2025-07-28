import { STORAGE_KEYS } from '@constants';

const API_BASE = 'http://localhost:3001';

const generateId = () => Date.now().toString();

export const studentsService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/students`);
    return response.json();
  },
  add: async (student) => {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...student, id: generateId() })
    });
    return response.json();
  },
  update: async (id, updatedStudent) => {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    });
    return response.json();
  },
  delete: async (id) => {
    await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    return true;
  }
};

export const teachersService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/teachers`);
    return response.json();
  },
  add: async (teacher) => {
    const response = await fetch(`${API_BASE}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...teacher, id: generateId() })
    });
    return response.json();
  },
  update: async (id, updatedTeacher) => {
    const response = await fetch(`${API_BASE}/teachers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTeacher)
    });
    return response.json();
  },
  delete: async (id) => {
    await fetch(`${API_BASE}/teachers/${id}`, { method: 'DELETE' });
    return true;
  }
};

export const classesService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/classes`);
    return response.json();
  },
  add: async (classData) => {
    const response = await fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...classData, id: generateId(), students: [], teacherId: null })
    });
    return response.json();
  },
  update: async (id, updatedClass) => {
    const response = await fetch(`${API_BASE}/classes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClass)
    });
    return response.json();
  },
  delete: async (id) => {
    await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
    return true;
  },
  assignTeacher: async (classId, teacherId) => {
    return classesService.update(classId, { teacherId });
  },
  assignStudent: async (classId, studentId) => {
    const response = await fetch(`${API_BASE}/classes/${classId}`);
    const classData = await response.json();
    if (!classData.students.includes(studentId)) {
      classData.students.push(studentId);
      return classesService.update(classId, classData);
    }
    return classData;
  },
  removeStudent: async (classId, studentId) => {
    const response = await fetch(`${API_BASE}/classes/${classId}`);
    const classData = await response.json();
    classData.students = classData.students.filter(id => id !== studentId);
    return classesService.update(classId, classData);
  }
};

export const attendanceService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/attendance`);
    return response.json();
  },
  mark: async (classId, date, attendanceData) => {
    const response = await fetch(`${API_BASE}/attendance?classId=${classId}&date=${date}`);
    const existing = await response.json();
    
    const record = {
      id: existing.length > 0 ? existing[0].id : generateId(),
      classId,
      date,
      attendance: attendanceData,
      markedAt: new Date().toISOString()
    };

    if (existing.length > 0) {
      const updateResponse = await fetch(`${API_BASE}/attendance/${existing[0].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      return updateResponse.json();
    } else {
      const createResponse = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      return createResponse.json();
    }
  },
  getByClassAndDate: async (classId, date) => {
    const response = await fetch(`${API_BASE}/attendance?classId=${classId}&date=${date}`);
    const records = await response.json();
    return records[0] || null;
  }
};



export const clearAllData = async () => {
  try {
    const [students, teachers, classes, attendance] = await Promise.all([
      fetch(`${API_BASE}/students`).then(r => r.json()),
      fetch(`${API_BASE}/teachers`).then(r => r.json()),
      fetch(`${API_BASE}/classes`).then(r => r.json()),
      fetch(`${API_BASE}/attendance`).then(r => r.json())
    ]);

    await Promise.all([
      ...students.map(s => fetch(`${API_BASE}/students/${s.id}`, { method: 'DELETE' })),
      ...teachers.map(t => fetch(`${API_BASE}/teachers/${t.id}`, { method: 'DELETE' })),
      ...classes.map(c => fetch(`${API_BASE}/classes/${c.id}`, { method: 'DELETE' })),
      ...attendance.map(a => fetch(`${API_BASE}/attendance/${a.id}`, { method: 'DELETE' }))
    ]);

    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.USER && key !== STORAGE_KEYS.TOKEN && key !== STORAGE_KEYS.THEME) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};