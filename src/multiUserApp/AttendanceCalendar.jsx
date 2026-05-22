import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AttendanceCalendar = ({ student, onClose, onSave }) => {
  const [markedDates, setMarkedDates] = useState([]);

  useEffect(() => {
    if (student.attendance) {
      setMarkedDates(student.attendance);
    } else {
      setMarkedDates([]);
    }
  }, [student]);

  const onDateClick = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const isPresent = markedDates.includes(dateStr);
    let updatedDates;

    if (isPresent) {
      updatedDates = markedDates.filter((d) => d !== dateStr);
    } else {
      updatedDates = [...markedDates, dateStr];
    }
    setMarkedDates(updatedDates);
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().slice(0, 10);
    return markedDates.includes(dateStr) ? "bg-green-500 text-white font-bold" : null;
  };

  const handleSave = () => {
    onSave(student.id, markedDates);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full relative">
        <button className="absolute top-3 right-3 text-xl font-bold" onClick={onClose}>
          &times;
        </button>
        <h3 className="mb-3 text-xl font-semibold">Attendance for {student.name}</h3>
        <Calendar onClickDay={onDateClick} tileClassName={tileClassName} />
        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
