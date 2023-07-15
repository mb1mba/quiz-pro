import React from "react";

export default function Category(props){
    const { handleClick, toggleState, name } = props;

    const handleButtonClick = () => {
      handleClick()
      toggleState()
    };
   return(
        <button 
        id={props.id} 
        className="button" 
        onClick={handleButtonClick}>{props.name}</button>
    )
}