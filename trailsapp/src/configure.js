import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Configure() {

  // Variables for the new Trail
  const [newTrailName, setNewTrailName] = useState("");
  const [newTrailDate, setNewTrailDate] = useState("");

  // Navigate variable
  const navigate = useNavigate();
  
  // Add trail and navigate to the main page
  const handleAddTrail = (event) => {
    event.preventDefault();
  
    const newTrail = {
      name: newTrailName,
      date: newTrailDate,
    };
  
    navigate('/', { state: { newTrail } });
  
    setNewTrailName("");
    setNewTrailDate("");
  };
  
  return (
    <div className="grid place-items-center min-h-screen">
      <form onSubmit={handleAddTrail} className="flex flex-col items-start gap-5 w-full max-w-md bg-white p-8 border border-slate-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 self-center">Configure Trail</h2>

        <div className="flex flex-col w-full">
          <label className="font-bold mb-1">Trail Name:</label>
          <input
            type="text"
            name="nameInput"
            placeholder="Name..."
            className="p-2 border border-slate-700 rounded-lg w-full"
            value={newTrailName}
            onChange={(event) => setNewTrailName(event.target.value)}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="font-bold mb-1">Trail Date:</label>
          <input
            type="date"
            name="dateInput"
            className="p-2 border border-slate-700 rounded-lg w-full"
            value={newTrailDate}
            onChange={(event) => setNewTrailDate(event.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 w-full mt-4">
          <button type="submit" className="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
            Confirm
          </button>
          <Link to="/">
            <button className="border rounded-lg px-4 py-2 bg-red-500 text-white hover:bg-red-600">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Configure;
