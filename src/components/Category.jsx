import React from "react";

export default function Category({handleClick, toggleState, name, id){

    const handleButtonClick = () => {
      handleClick()
      toggleState()
    };
    
   return(
        <button 
        id={id} 
        className="button" 
        onClick={handleButtonClick}>{name}</button>
    )
}
