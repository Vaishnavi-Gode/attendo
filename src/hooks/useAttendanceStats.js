// Attendance statistics updates based on date and context for admin and teacher dashboards
import { useState, useEffect } from "react";
import { colors } from "@theme";
import { ATTENDANCE_STATUS } from "@constants";
import {
  studentsService,
  classesService,
  attendanceService,
} from "@services/baseService";

export const useAttendanceStats = (selectedDate, userRole, userId) => {
  //Statistics values
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    totalToday: 0,
    overallAttendanceRate: 0,
    todayPieData: [],
    classWiseToday: [],
  });

  //To trigger stats on value change
  useEffect(() => {
    calculateStats();
  }, [selectedDate, userRole, userId]);

  //Fetch data from db
  const calculateStats = async () => {
    const students = await studentsService.getAll();
    const classes = await classesService.getAll();
    const attendanceRecords = await attendanceService.getAll();

    let filteredClasses = classes;
    let filteredStudents = students;

    // Filter based on user role teacher to show students from her class
    if (userRole === "teacher") {
      filteredClasses = classes.filter((c) => c.teacherId === userId);
      const classStudentIds = filteredClasses.flatMap((c) => c.students || []); // To pull student array from each filtered class and put them in single array
      filteredStudents = students.filter((s) => classStudentIds.includes(s.id));
    }

    const totalStudents = filteredStudents.length;
    const totalClasses = filteredClasses.length;

    // Today's attendance for respective class
    const todayRecords = attendanceRecords.filter(
      (r) =>
        r.date === selectedDate &&
        filteredClasses.some((c) => c.id === r.classId) //	Keep only records that belong to this teacher’s classes
    );

    let presentToday = 0;
    let totalToday = 0;
    const classStats = {};

    //Current day stats for selected date and classes - filter and count
    todayRecords.forEach((record) => {
      const classData = filteredClasses.find((c) => c.id === record.classId);
      if (classData) {
        const attendance = Object.values(record.attendance);

        const present = attendance.filter(
          (s) => s === ATTENDANCE_STATUS.PRESENT
        ).length;

        const absent = attendance.filter(
          (s) => s === ATTENDANCE_STATUS.ABSENT
        ).length;

        presentToday += present;
        totalToday += present + absent;

        classStats[classData.name] = {
          name: classData.name,
          present,
          absent,
        };
      }
    });

    // Overall attendance rate - filter and count
    const relevantRecords = attendanceRecords.filter((r) =>
      filteredClasses.some((c) => c.id === r.classId)
    );

    let totalPresentAll = 0;
    let totalRecordsAll = 0;

    //present students and total attendance
    relevantRecords.forEach((record) => {
      const attendance = Object.values(record.attendance);
      totalPresentAll += attendance.filter(
        (s) => s === ATTENDANCE_STATUS.PRESENT
      ).length;
      totalRecordsAll += attendance.length;
    });

    //Attendance percentage
    const overallAttendanceRate =
      totalRecordsAll > 0
        ? Math.round((totalPresentAll / totalRecordsAll) * 100)
        : 0;

    //Pie chart data
    const todayPieData = [
      { name: "Present", value: presentToday, color: colors.accent },
      {
        name: "Absent",
        value: totalToday - presentToday,
        color: colors.highlight,
      },
    ];

    //Statistics object to array of charts
    const classWiseToday = Object.values(classStats);

    setStats({
      totalStudents,
      totalClasses,
      presentToday,
      totalToday,
      overallAttendanceRate,
      todayPieData,
      classWiseToday,
    });
  };

  return stats;
};
