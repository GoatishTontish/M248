import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Configure() {
  const [newTrailName, setNewTrailName] = useState("");
  const [newTrailDate, setNewTrailDate] = useState("");

  const navigate = useNavigate();
  
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
    <div>
      {/* ... rest of your code ... */}
      <form onSubmit={handleAddTrail}>
        <label class="font-bold">Name: </label>
        <input
          type="text"
          name="nameEingabe"
          class="p-2 border border-slate-700 row-span-1 grid mb-5 w-2/6"
          value={newTrailName}
          onChange={(event) => setNewTrailName(event.target.value)}
        />
  
        <label class="font-bold">Ausflugsdatum: </label>
        <input
          type="text"
          name="ausflugsDatumEingabe"
          class="p-2 border border-slate-700 row-span-1 grid w-2/6"
          value={newTrailDate}
          onChange={(event) => setNewTrailDate(event.target.value)}
        />
        <Link to="/">
          <button class="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 mr-3">
            Abbrechen
          </button>
        </Link>
        <button type="submit" class="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 mt-5 w-2/6">
          Bestätigen
        </button>
      </form>
    </div>
  );
  }
  
  export default Configure;
  