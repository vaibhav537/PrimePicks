import React from 'react'

const SLoader = ({ text = "Loading" }) => {
  return (
    <div className="flex space-x-1 justify-center items-center">
    {text.split("").map((char, index) => (
      <span
        key={index}
        className="animate-jump text-primary"
        style={{
          animationDelay: `${index * 0.2}s`, // Stagger animation for each letter
        }}
      >
        {char}
      </span>
    ))}
  </div>
  )
}

export default SLoader