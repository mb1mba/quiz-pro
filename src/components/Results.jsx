import React, {useEffect} from "react";
import setBodyColor from "./setBodyColor";

export default function Results({score, outOf, toggleState, resetGame}){
    setBodyColor({color: "#C6371A"})


    const resultText = score === 5 ? "WOW" : 
        score >=2  ?  "CLOSE" :
        "NOPE";
    
    const resultComment =
    score === 5
        ? "You have good knowledge. Maybe you should play Who Wants to Be a Millionaire?"
        : score >= 2
        ? "Keep up the momentum, because every step forward is a victory on the road to success."
        : "The results are only a temporary measure of your knowledge at a given moment. Use this experience as an opportunity to learn and grow.";

    return(
        <div  className="result-div">
            <h1 className="result-text">{resultText}</h1>
            <h2 className="result-congrats">CONGRATS YOUR SCORE</h2>
            <h1>{score}/{outOf}</h1>
            <h3 className="result-encouragement">{resultComment}</h3>
            <div className="result-button-container"> 
                { score <= 5 ? 
                <div>
                <button className="button result" onClick={toggleState}>Correct answers</button>
                <button className="button result" onClick={resetGame}>Play Again</button>
                </div>
                 : null}
            </div>
        </div>
    )
}