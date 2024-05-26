import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import TicTacToe from './pages/TicTacToe/TicTacToe.jsx'
import Battleship from './pages/Battleship/Battleship.jsx'
import NotFound from './pages/404/404.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<App />}>
        <Route
          path='/'
          element={
            <img className='img-dice' src='/juegos.png' alt='Dice Image' />
          }
        />
        <Route path='TicTacToe' element={<TicTacToe />} />
        <Route path='BattleShip' element={<Battleship />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
