import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import Configure from './configure'

function App() {
  const [trailNames, setTrailNames] = useState(['Eschenbach', 'Herisau', 'Toggenburg']);
  const [trailDates, setTrailDates] = useState(['05.05.2024', '06.05.2024', '07.05.2024']);
  const [showRemoveButtons, setShowRemoveButtons] = useState(false);


  // Fetch data from local storage on component mount
  useEffect(() => {
    const storedTrailNames = localStorage.getItem('trailNames');
    const storedTrailDates = localStorage.getItem('trailDates');

    if (storedTrailNames && storedTrailDates) {
      try {
        setTrailNames(JSON.parse(storedTrailNames));
        setTrailDates(JSON.parse(storedTrailDates));
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Consider setting default values or handling errors gracefully
      }
    } 
  }, []);

  // Save data to local storage on changes to trailNames or trailDates
  useEffect(() => {
    localStorage.setItem('trailNames', JSON.stringify(trailNames));
    localStorage.setItem('trailDates', JSON.stringify(trailDates));
  }, [trailNames, trailDates]);

  const handleRemoveTrail = (index) => {
    const newTrailNames = [...trailNames];
    const newTrailDates = [...trailDates];
    newTrailNames.splice(index, 1);
    newTrailDates.splice(index, 1);
    setTrailNames(newTrailNames);
    setTrailDates(newTrailDates);
  };

  const listNames = trailNames.map((trailName, index) => (
    <div key={index} class="border border-slate-900 pl-15 py-5 text-center mb-2">
      {trailName}
    </div>
  ));

  const listDates = trailDates.map((trailDate, index) => (
    <div key={index} class="border border-slate-900 pl-15 py-5 text-center mb-2">
      {trailDate}
    </div>
  ));

  const removeButtons = trailNames.map((trailName, index) => (
      <button
        class={`border rounded-full w-10 h-10 text-3xl border-slate-900 mb-9 ${
          showRemoveButtons ? 'visible' : 'invisible'
              }`}
        onClick={() => handleRemoveTrail(index)}>
          X
        </button>
      ));



  return (
    <div>
      <header>

      </header>
      <main>

        <div class="border border-slate-900 ml-12 mr-6 mt-12">
          <div class="grid grid-cols-1 justify-items-center">
            <label>Wanderungen</label>
          </div>

          <div class="flex grid-cols-3 gap-10 w-11/12 ml-12 mb-5">
            <div class="block w-1/3">
              <div class="border border-slate-900 pl-15 py-5 mb-5 font-bold text-center">
                Name
              </div>
              {listNames}
            </div>

            <div class="block w-4/6">
              <div class="border border-slate-900 pl-15 py-5 mb-5 font-bold text-center">
                Ausflugsdatum
              </div>
              {listDates}
            </div>
            <div class="mt-24">
              <div class="w-2">
              {removeButtons}
              </div>
            </div>

          </div>
        </div>

      </main>
      <footer>

        <div class="fixed bottom-2 right-5">
          <button class="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 mr-3">
            Hinzufügen
          </button>
          <button class="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setShowRemoveButtons(!showRemoveButtons)}>
            Löschen
          </button>

        </div>
      </footer>
    </div>
  );
}

export default App;
