import './App.css'
import { NavLink, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <header>
        <h1>Virtual Games Room</h1>
        <nav>
          <NavLink to={'TicTacToe'}>
            <img src='/ticTacToe.png' alt='ticTacToe' /> Tic Tac Toe
          </NavLink>
          <NavLink to={'Battleship'}>
            <img src='/barco.png' alt='ship' />
            Battleship
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Created by Alicia Gálvez</footer>
    </div>
  )
}

export default App
