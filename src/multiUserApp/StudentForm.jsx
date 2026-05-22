import React, { useEffect, useState } from "react";

const StudentForm = ({ student, onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setJoinDate] = useState(new Date().toISOString().slice(0, 10));
  const [feesDate, setFeesDate] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setPhone(student.phone);
      setJoinDate(student.joinDate);
      setFeesDate(student.feesDate);
      setProfileImage(student.profileImage || "");
    } else {
      setName("");
      setPhone("");
      setJoinDate(new Date().toISOString().slice(0, 10));
      setFeesDate("");
      setProfileImage("");
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !joinDate || !feesDate) {
      alert("Please fill all fields");
      return;
    }
    onSave({
      id: student ? student.id : Date.now(),
      name,
      phone,
      joinDate,
      feesDate,
      profileImage,
      attendance: student ? student.attendance || [] : [],
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg p-6 bg-purple-100 rounded space-y-5 shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold text-purple-800 text-center">
        {student ? "Edit Student" : "Add New Student"}
      </h2>
      <div>
        <label className="block font-semibold mb-1">Profile Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
        {profileImage && (
          <img src={profileImage} alt="" className="mt-2 w-20 h-20 rounded-full object-cover" />
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded border" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 rounded border" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Join Date</label>
        <input type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="w-full p-3 rounded border" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Fee Due Date</label>
        <input type="date" value={feesDate} onChange={e => setFeesDate(e.target.value)} className="w-full p-3 rounded border" />
      </div>
      <div className="flex justify-between space-x-4">
        <button type="submit" className="bg-purple-700 text-white rounded px-6 py-2 hover:bg-purple-800 transition font-semibold">
          {student ? "Update" : "Add"}
        </button>
        <button type="button" className="bg-gray-300 rounded px-6 py-2 hover:bg-gray-400 transition font-semibold" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
