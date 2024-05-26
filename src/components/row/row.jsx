import React from 'react'
import Square from '../Square/square'
import './row.css'

function Row(props) {
  return (
    <div className='board-row'>
      {props.squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => props.onClick(index)}
        />
      ))}
    </div>
  )
}

export default Row
