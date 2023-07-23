import React from "react";

export default function Home({toggleState){
    return(
        <div className="home-page">
            <h1 className="home-page-text">What?</h1>
            <button onClick={toggleState} className="button home">Start quiz</button>
        </div>
    )
}
