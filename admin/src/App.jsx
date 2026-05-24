import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Add from './pages/Add';
import List from './pages/List';
import Booking from './pages/Booking';
import Edit from './pages/Edit';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/addCourse' element={<Add/>}/>
      <Route path='/listCourse' element={<List/>}/>
      <Route path='/bookings' element={<Booking/>}/>
      <Route path='/editCourse/:id' element={<Edit/>}/>
    </Routes>
  )
}

export default App
