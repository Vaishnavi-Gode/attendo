import axios from "axios";

const API_BASE_URL = "https://randomuser.me/api/";

export const fetchRandomUsers = async (count = 60) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?results=${count}&nat=us`);
    return response.data.results;
  } catch (error) {
    throw new Error("Failed to fetch random users");
  }
};

export const generateRandomData = async () => {
  const users = await fetchRandomUsers(60);

  // Generate teachers (first 10 users)
  const teachers = users.slice(0, 10).map((user, index) => ({
    id: `t${index + 1}`,
    firstName: user.name.first,
    lastName: user.name.last,
    email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@school.com`,
    password: "password",
    subject: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Geography",
      "Computer Science",
      "Art",
      "Music",
    ][index],
  }));

  // Generate students (next 50 users)
  const students = users.slice(10, 60).map((user, index) => ({
    id: `s${index + 1}`,
    firstName: user.name.first,
    lastName: user.name.last,
    email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@student.com`,
    password: "password",
    rollNumber: `S${String(index + 1).padStart(3, "0")}`,
  }));

  // Generate classes
  const classes = Array.from({ length: 10 }, (_, index) => {
    const standards = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
    ];
    const classNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return {
      id: `c${index + 1}`,
      name: `Class ${classNames[index]}`,
      standard: `${standards[index]} Standard`,
      teacherId: teachers[index].id,
      students: students.slice(index * 5, (index + 1) * 5).map((s) => s.id),
    };
  });

  // Generate attendance for past 60 days
  const attendanceRecords = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    // Skip weekends (Saturday=6, Sunday=0) - only Mon-Fri working days
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    classes.forEach((classItem) => {
      const attendance = {};
      classItem.students.forEach((studentId) => {
        // 85% chance of being present
        attendance[studentId] = Math.random() > 0.15 ? "present" : "absent";
      });

      attendanceRecords.push({
        id: `${classItem.id}_${dateStr}`,
        classId: classItem.id,
        date: dateStr,
        attendance,
        markedAt: new Date().toISOString(),
      });
    });
  }

  // Save to json-server
  await Promise.all([
    ...teachers.map(teacher => 
      fetch('http://localhost:3001/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
      })
    ),
    ...students.map(student => 
      fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      })
    ),
    ...classes.map(classItem => 
      fetch('http://localhost:3001/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classItem)
      })
    ),
    ...attendanceRecords.map(record => 
      fetch('http://localhost:3001/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      })
    )
  ]);

  return { teachers, students, classes, attendanceRecords };
};
