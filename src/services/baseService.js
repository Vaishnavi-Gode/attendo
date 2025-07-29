import axios from 'axios';

const API_BASE = "http://localhost:3001";
const generateId = () => Date.now().toString();

const createService = (endpoint) => ({
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/${endpoint}`);
    return response.data;
  },
  add: async (data) => {
    const response = await axios.post(`${API_BASE}/${endpoint}`, { ...data, id: generateId() });
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.patch(`${API_BASE}/${endpoint}/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${API_BASE}/${endpoint}/${id}`);
    return true;
  },
});

export const studentsService = createService("students");
export const teachersService = createService("teachers");
export const classesService = {
  ...createService("classes"),
  add: async (classData) => {
    const response = await axios.post(`${API_BASE}/classes`, {
      ...classData,
      id: generateId(),
      students: [],
      teacherId: null,
    });
    return response.data;
  },
  assignTeacher: async (classId, teacherId) => {
    return classesService.update(classId, { teacherId });
  },
  assignStudent: async (classId, studentId) => {
    const response = await axios.get(`${API_BASE}/classes/${classId}`);
    const classData = response.data;
    if (!classData.students.includes(studentId)) {
      classData.students.push(studentId);
      return classesService.update(classId, classData);
    }
    return classData;
  },
  removeStudent: async (classId, studentId) => {
    const response = await axios.get(`${API_BASE}/classes/${classId}`);
    const classData = response.data;
    classData.students = classData.students.filter((id) => id !== studentId);
    return classesService.update(classId, classData);
  },
};

export const attendanceService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/attendance`);
    return response.data;
  },
  mark: async (classId, date, attendanceData) => {
    const response = await axios.get(`${API_BASE}/attendance?classId=${classId}&date=${date}`);
    const existing = response.data;

    const record = {
      id: existing.length > 0 ? existing[0].id : generateId(),
      classId,
      date,
      attendance: attendanceData,
      markedAt: new Date().toISOString(),
    };

    if (existing.length > 0) {
      const updateResponse = await axios.put(`${API_BASE}/attendance/${existing[0].id}`, record);
      return updateResponse.data;
    } else {
      const createResponse = await axios.post(`${API_BASE}/attendance`, record);
      return createResponse.data;
    }
  },
  getByClassAndDate: async (classId, date) => {
    const response = await axios.get(`${API_BASE}/attendance?classId=${classId}&date=${date}`);
    const records = response.data;
    return records[0] || null;
  },
};

export const clearAllData = async () => {
  try {
    const [students, teachers, classes, attendance] = await Promise.all([
      axios.get(`${API_BASE}/students`).then(r => r.data),
      axios.get(`${API_BASE}/teachers`).then(r => r.data),
      axios.get(`${API_BASE}/classes`).then(r => r.data),
      axios.get(`${API_BASE}/attendance`).then(r => r.data)
    ]);

    await Promise.all([
      ...students.map(s => axios.delete(`${API_BASE}/students/${s.id}`)),
      ...teachers.map(t => axios.delete(`${API_BASE}/teachers/${t.id}`)),
      ...classes.map(c => axios.delete(`${API_BASE}/classes/${c.id}`)),
      ...attendance.map(a => axios.delete(`${API_BASE}/attendance/${a.id}`))
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
