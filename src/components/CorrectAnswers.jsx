import React from "react";
import setBodyColor from "./setBodyColor";

export default function CorrectAnswers(props) {
  setBodyColor({ color: "#FFFFFF" });

  return (
    <div className="questions-container">
      <h1 className="question-title">{props.q}</h1>
      <div className="answers-container">
        {props.answers.map((answer) => (
          <button
            key={answer.id}
            className="button"
            id={props.id}
            style={{
              backgroundColor: answer.isCorrect ? "#91c499" : "#ead7d7",
              color: answer.isCorrect ? "white" : "grey",
            }}
          >
            {answer.answer}
          </button>
        ))}
      </div>
    </div>
  );
}