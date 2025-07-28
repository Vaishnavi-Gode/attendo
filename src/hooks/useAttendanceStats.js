import { useState, useEffect } from 'react';
import { colors } from '@theme';
import { ATTENDANCE_STATUS } from '@constants';
import { studentsService, classesService, attendanceService } from '@services/storageService';

export const useAttendanceStats = (selectedDate, userRole, userId) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    totalToday: 0,
    overallAttendanceRate: 0,
    todayPieData: [],
    classWiseToday: []
  });

  useEffect(() => {
    calculateStats();
  }, [selectedDate, userRole, userId]);

  const calculateStats = async () => {
    const students = await studentsService.getAll();
    const classes = await classesService.getAll();
    const attendanceRecords = await attendanceService.getAll();
    
    let filteredClasses = classes;
    let filteredStudents = students;
    
    // Filter based on user role
    if (userRole === 'teacher') {
      filteredClasses = classes.filter(c => c.teacherId === userId);
      const classStudentIds = filteredClasses.flatMap(c => c.students || []);
      filteredStudents = students.filter(s => classStudentIds.includes(s.id));
    }
    
    const totalStudents = filteredStudents.length;
    const totalClasses = filteredClasses.length;
    
    // Today's attendance
    const todayRecords = attendanceRecords.filter(r => 
      r.date === selectedDate && 
      filteredClasses.some(c => c.id === r.classId)
    );
    
    let presentToday = 0;
    let totalToday = 0;
    const classStats = {};
    
    todayRecords.forEach(record => {
      const classData = filteredClasses.find(c => c.id === record.classId);
      if (classData) {
        const attendance = Object.values(record.attendance);
        const present = attendance.filter(s => s === ATTENDANCE_STATUS.PRESENT).length;
        const absent = attendance.filter(s => s === ATTENDANCE_STATUS.ABSENT).length;
        
        presentToday += present;
        totalToday += present + absent;
        
        classStats[classData.name] = {
          name: classData.name,
          present,
          absent
        };
      }
    });
    
    // Overall attendance rate
    const relevantRecords = attendanceRecords.filter(r => 
      filteredClasses.some(c => c.id === r.classId)
    );
    
    let totalPresentAll = 0;
    let totalRecordsAll = 0;
    
    relevantRecords.forEach(record => {
      const attendance = Object.values(record.attendance);
      totalPresentAll += attendance.filter(s => s === ATTENDANCE_STATUS.PRESENT).length;
      totalRecordsAll += attendance.length;
    });
    
    const overallAttendanceRate = totalRecordsAll > 0 ? Math.round((totalPresentAll / totalRecordsAll) * 100) : 0;
    
    const todayPieData = [
      { name: 'Present', value: presentToday, color: colors.accent },
      { name: 'Absent', value: totalToday - presentToday, color: colors.highlight }
    ];
    
    const classWiseToday = Object.values(classStats);
    
    setStats({
      totalStudents,
      totalClasses,
      presentToday,
      totalToday,
      overallAttendanceRate,
      todayPieData,
      classWiseToday
    });
  };

  return stats;
};