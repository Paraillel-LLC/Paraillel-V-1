import React, { useState } from 'react';
import './App.css';
import ChatGPT from './pages/ChatGPT';
import Cale from './pages/Cale';
import Assignment from './pages/Assignments';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Privacy from './pages/Privacy';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Assignment/>}/>
            <Route path='/privacy' element={<Privacy/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default App;