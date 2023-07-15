import React from "react";

export default function Difficulty({ handleClick, toggleState, value}){
    const handleButtonClick = () => {
      handleClick();
      toggleState();
    };
  
    return(
      <div>
              <button className="button" onClick={handleButtonClick} id="easy">{value}</button>
      </div>
    )
}