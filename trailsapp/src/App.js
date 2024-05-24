// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configure from './configure'
import Main from './main';

function app() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/configure" element={<Configure />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default app;