import React, { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import AttendanceCalendar from "./AttendanceCalendar";

const getTodayISO = () => new Date().toISOString().split("T")[0];

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("myAppUsers")) || [];
    setUsers(storedUsers);
  }, []);

  const updateUsersStorage = (newUsers) => {
    localStorage.setItem("myAppUsers", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const updateAdminStudents = (newStudents) => {
    const newUsers = users.map((u) =>
      u.id === adminUser.id ? { ...u, students: newStudents } : u
    );
    updateUsersStorage(newUsers);
    setAdminUser({ ...adminUser, students: newStudents });
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const addOrEditStudent = (student) => {
    let updatedStudents = adminUser.students || [];

    if (editingStudent) {
      updatedStudents = updatedStudents.map((s) =>
        s.id === editingStudent.id ? { ...student, id: editingStudent.id } : s
      );
      showToast("Student updated");
    } else {
      updatedStudents = [...updatedStudents, { ...student, id: Date.now() }];
      showToast("Student added");
    }
    updateAdminStudents(updatedStudents);
    setEditingStudent(null);
  };

  const deleteStudent = (studentId) => {
    const filtered = (adminUser.students || []).filter((s) => s.id !== studentId);
    updateAdminStudents(filtered);
    showToast("Student deleted", "error");
  };

  const markTodayAttendance = (studentId) => {
    const today = getTodayISO();
    let updatedStudents = (adminUser.students || []).map((s) => {
      if (s.id === studentId) {
        const attendance = s.attendance || [];
        if (!attendance.includes(today)) {
          attendance.push(today);
        }
        return { ...s, attendance };
      }
      return s;
    });
    updateAdminStudents(updatedStudents);
    showToast("Attendance marked");
  };

  const saveAttendance = (studentId, attendance) => {
    let updatedStudents = (adminUser.students || []).map((s) =>
      s.id === studentId ? { ...s, attendance } : s
    );
    updateAdminStudents(updatedStudents);
    showToast("Attendance updated");
  };

  const filteredStudents = (adminUser.students || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
  );

  const getFeeStatus = (date) => {
    if (!date) return null;
    const today = getTodayISO();
    if (date < today) return "overdue";
    if (date === today) return "due";
    return "ok";
  };

  const isOverMonthFromJoin = (joinDate) => {
    if (!joinDate) return false;
    const join = new Date(joinDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const afterMonth = new Date(join);
    afterMonth.setMonth(afterMonth.getMonth() + 1);
    afterMonth.setHours(0, 0, 0, 0);
    return now >= afterMonth;
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {toast && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded shadow-lg font-semibold text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-purple-700">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
        >
          Logout
        </button>
      </header>

      <StudentForm
        student={editingStudent}
        onSave={addOrEditStudent}
        onCancel={() => setEditingStudent(null)}
      />

      <input
        type="search"
        placeholder="Search students by name or phone"
        className="w-full max-w-md p-3 border border-purple-300 rounded mb-4 focus:outline-none focus:ring focus:ring-purple-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full table-auto border-collapse border border-purple-200">
          <thead>
            <tr className="bg-purple-100 text-purple-800">
              <th className="border border-purple-300 p-2 text-left">Profile</th>
              <th className="border border-purple-300 p-2 text-left">Name</th>
              <th className="border border-purple-300 p-2 text-left">Phone</th>
              <th className="border border-purple-300 p-2 text-left">Join Date</th>
              <th className="border border-purple-300 p-2 text-left">Fee Date & Status</th>
              <th className="border border-purple-300 p-2 text-left">Attendance</th>
              <th className="border border-purple-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">No students found.</td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const feeStatus = getFeeStatus(student.feesDate);
                const reminderDue = isOverMonthFromJoin(student.joinDate);

                return (
                  <tr
                    key={student.id}
                    className={`border border-purple-300 ${
                      reminderDue ? "bg-yellow-50" : ""
                    } hover:bg-purple-50 cursor-pointer`}
                  >
                    <td className="border border-purple-300 p-2 text-center">
                      {student.profileImage ? (
                        <img
                          src={student.profileImage}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="border border-purple-300 p-2">{student.name}</td>
                    <td className="border border-purple-300 p-2">{student.phone}</td>
                    <td className="border border-purple-300 p-2">{student.joinDate}</td>
                    <td className="border border-purple-300 p-2">
                      {student.feesDate}{" "}
                      {feeStatus === "due" && (
                        <span className="bg-yellow-300 rounded px-1 text-yellow-900 text-xs ml-2">
                          Due Today
                        </span>
                      )}
                      {feeStatus === "overdue" && (
                        <span className="bg-red-300 rounded px-1 text-red-900 text-xs ml-2">
                          Overdue
                        </span>
                      )}
                      {feeStatus === "ok" && (
                        <span className="bg-green-300 rounded px-1 text-green-900 text-xs ml-2">
                          OK
                        </span>
                      )}
                      {reminderDue && (
                        <span
                          className="bg-orange-400 text-white rounded px-1 text-xs ml-2 cursor-default"
                          title="Fee reminder: one month passed since join date"
                        >
                          Reminder Due!
                        </span>
                      )}
                    </td>
                    <td className="border border-purple-300 p-2 text-center">
                      Attended: {(student.attendance || []).length} days
                      <button
                        className="block mt-2 bg-green-500 px-2 py-1 rounded text-xs text-white hover:bg-green-600"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View Attendance
                      </button>
                      <button
                        className="block mt-1 bg-green-600 px-2 py-1 rounded text-xs text-white hover:bg-green-700"
                        onClick={() => markTodayAttendance(student.id)}
                      >
                        Mark Present Today
                      </button>
                    </td>
                    <td className="border border-purple-300 p-2 space-x-2">
                      <button
                        className="bg-yellow-500 px-2 rounded text-white hover:bg-yellow-600"
                        onClick={() => setEditingStudent(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 px-2 rounded text-white hover:bg-red-700"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <AttendanceCalendar
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={saveAttendance}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
