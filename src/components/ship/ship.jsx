import React from 'react'

const Ship = ({ size, orientation, position }) => {
  const shipStyle = orientation === 'vertical' ? 'ship' : 'ship horizontal'

  return (
    <div
      className={shipStyle}
      style={{ left: position.x, top: position.y }}
    ></div>
  )
}

export default Ship
