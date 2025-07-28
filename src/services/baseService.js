const API_BASE = 'http://localhost:3001';
const generateId = () => Date.now().toString();

const createService = (endpoint) => ({
  getAll: async () => {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    return response.json();
  },
  add: async (data) => {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: generateId() })
    });
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async (id) => {
    await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
    return true;
  }
});

export const studentsService = createService('students');
export const teachersService = createService('teachers');
export const classesService = {
  ...createService('classes'),
  add: async (classData) => {
    const response = await fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...classData, id: generateId(), students: [], teacherId: null })
    });
    return response.json();
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
      classId, date, attendance: attendanceData,
      markedAt: new Date().toISOString()
    };

    const method = existing.length > 0 ? 'PUT' : 'POST';
    const url = existing.length > 0 ? `${API_BASE}/attendance/${existing[0].id}` : `${API_BASE}/attendance`;
    
    const updateResponse = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return updateResponse.json();
  },
  getByClassAndDate: async (classId, date) => {
    const response = await fetch(`${API_BASE}/attendance?classId=${classId}&date=${date}`);
    const records = await response.json();
    return records[0] || null;
  }
};