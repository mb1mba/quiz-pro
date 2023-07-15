import React from "react";

export default function Home(props){
    return(
        <div className="home-page">
            <h1 className="home-page-text">What?</h1>
            <button onClick={props.toggleState} className="button home">Start quiz</button>
        </div>
    )
}