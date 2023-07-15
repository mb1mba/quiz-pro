import React,  { useEffect } from "react";
import setBodyColor from "./setBodyColor";

export default function Game({q, answers, handleQuestions, id, goNextQuestion}) {

  useEffect(() => {
    setBodyColor({ color: "#FFFFFF" });
  }, []);
  
  return (
    <div className="questions-container">
      <h1>{q}</h1>
      <div className="answers-container">
        {answers.map(answer => (
          <button
            onClick={() => handleQuestions(answer.id)}
            key={answer.id}
            className="button"
            id={id}
            style={{
              backgroundColor: answer.isSelected ? "#C6371A" : "white",
              color: answer.isSelected ? "white" : "black"
            }}
            
          >
            {answer.answer}
          </button>
        ))}
      </div>
      <button onClick={goNextQuestion} className='button next'> Next </button>
    </div>
  );
  
}