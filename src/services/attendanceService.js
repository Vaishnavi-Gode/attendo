const ATTENDANCE_KEY = 'attendo_attendance';

export const getAttendanceRecords = () => {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
};

export const markAttendance = (classId, date, attendanceData) => {
  const records = getAttendanceRecords();
  const existingIndex = records.findIndex(r => r.classId === classId && r.date === date);
  
  const newRecord = {
    id: existingIndex >= 0 ? records[existingIndex].id : Date.now().toString(),
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

  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('attendanceUpdated'));
  
  return newRecord;
};

export const getAttendanceByClassAndDate = (classId, date) => {
  const records = getAttendanceRecords();
  return records.find(r => r.classId === classId && r.date === date);
};