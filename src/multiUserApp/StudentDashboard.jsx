import React, { useState } from "react";
import AttendanceCalendar from "./AttendanceCalendar";

const StudentDashboard = ({ user, onLogout }) => {
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const students = user.students || [];
  const student = students[0] || {}; // For students, show their own profile

  const openAttendance = () => setAttendanceModalOpen(true);
  const closeAttendance = () => setAttendanceModalOpen(false);

  const saveAttendance = (studentId, attendance) => {
    const users = JSON.parse(localStorage.getItem("myAppUsers")) || [];
    const newUsers = users.map((u) => {
      if (u.id === user.id) {
        const newStudents = u.students.map((s) =>
          s.id === studentId ? { ...s, attendance } : s
        );
        return { ...u, students: newStudents };
      }
      return u;
    });
    localStorage.setItem("myAppUsers", JSON.stringify(newUsers));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg bg-white space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-700">My Profile</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <section className="text-center">
        {student.profileImage ? (
          <img
            src={student.profileImage}
            alt={student.name}
            className="w-32 h-32 object-cover rounded-full shadow-lg mx-auto"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <h2 className="mt-4 text-2xl font-semibold">{student.name}</h2>
        <p className="text-gray-600">{student.phone}</p>
        <p className="text-gray-600">
          Joined on: {student.joinDate || "N/A"}
        </p>
        <p className="text-gray-600">
          Fee Due Date: {student.feesDate || "N/A"}
        </p>
      </section>

      <section className="text-center space-y-4">
        <p className="font-semibold text-lg">
          Attendance: {(student.attendance || []).length} days
        </p>
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          onClick={openAttendance}
        >
          View / Mark Attendance
        </button>
      </section>

      {attendanceModalOpen && (
        <AttendanceCalendar
          student={student}
          onClose={closeAttendance}
          onSave={saveAttendance}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
