import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Category from './components/Category';
import data from './data';
import Game from './components/Game';
import Difficulty from './components/Difficulty'
import Results from './components/Results';
import CorrectAnswers from './components/CorrectAnswers';
import { nanoid } from 'nanoid';
import setBodyColor from "./components/setBodyColor";

export default function App() {
  setBodyColor({color: "#FFFFFF"})
  const [startButtonPressed, setStartButtonPressed] = useState(false);
  const [categoryChoosen, setCategoryChoosen] = useState(false);
  const [difficultyChoosen, setDifficultyChoosen] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [gameParameters, setGameParameters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [dataArrays, setDataArrays] = useState(data);
  const levels = ['easy', 'medium', 'hard'];
  const [questionsOrder, setQuestionsOrder] =  useState(0);
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState();
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  let score = 0

  // Using useEffect to make an API request when the difficulty is chosen
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${gameParameters[0]}&difficulty=${gameParameters[1]}`);
        const data = await response.json();
        // This code is mapping over the results array from the API response data 
        // and creating a modified version of each question object.
        const modifiedQuestions = data.results.map((questionsArray) => ({
          ...questionsArray,
          correct_answer: { answer: questionsArray.correct_answer, id: nanoid(), isCorrect: true },
          incorrect_answers: questionsArray.incorrect_answers.map((incorrect_answer) => ({
            answer: incorrect_answer,
            id: nanoid(),
            isSelected: false,
          })),
        }));

        // This code performs a mapping operation on the modifiedQuestions array
        // to create a new version of each question object. The code prepare the 
        // data for displaying the questions and answers in the quiz application,
        // ensuring that the answers are randomly shuffled to provide a varied gaming experience.
        const shuffledQuestions = modifiedQuestions.map((question) => ({
          ...question,
          answers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
        }));

        // Update questions array
        setQuestions(shuffledQuestions);
        // This code mapping over shuffledQuestions array. This allow to create 
        // a new array of correct answers and updating correctAnswers arrays by extracting corrects answers.
        // This will allow to compare the players' answers later on and calculate the score.
        const collectCorrectAnswers = shuffledQuestions.map((question) => question.correct_answer);
        setCorrectAnswers(collectCorrectAnswers);
      } 
      catch (error) {
        console.log(error);
      }
    };

    if (difficultyChoosen) {
      fetchQuestions();
    }
  }, [difficultyChoosen, gameParameters]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function handleQuestions(id) {
    setQuestions(oldQuestions => {
      const selectedQuestion = oldQuestions.map(question => {
        const modifiedAnswers = question.answers.map(answer => ({
          ...answer,
          isSelected: answer.id === id ? true : false
        }));
  
        return { ...question, answers: modifiedAnswers };
      });
  
      return selectedQuestion;
    });
    setIsClickable(true);
  }
  

  // the goNextQuestion function allows the user to move to the next question in the game. 
  // It updates the question order, disables answer selection, resets the selected answers, 
  // updates the game's progress, checks if the game is over.
  function goNextQuestion(){
    if(isClickable){

      setQuestionsOrder(prevQuestion => prevQuestion + 1);
      setIsClickable(false);
//This is to prevent the previous answer from remaining selected. Without this line of code, 
//the player could inadvertently add the previous answer to the playerAnswers array,
// even though they haven't selected an answer for the new question.
      setQuestions(oldQuestions => {
        const updatedQuestions = oldQuestions.map(question => {
          const updatedAnswers = question.answers.map(answer => ({
            ...answer,
            isSelected: false
          }));
          return { ...question, answers: updatedAnswers };
        });
        return updatedQuestions;
      });

      const totalQuestions = questions.length;
      const currentProgress = (questionsOrder + 1) / totalQuestions * 100;
      setProgress(currentProgress);

      if(progress === 80){
          setIsGameOver(true);
      }
      document.documentElement.scrollTop = 0;
    }
    updatePlayerAnswers()
  }

  function updatePlayerAnswers() {
    const newPlayerAnswers = questions.flatMap(question => {
      const selectedAnswers = question.answers
        .filter(answer => answer.isSelected)
        .map(answer => ({
          answer: answer.answer,
          id: answer.id
        }));
  
      return selectedAnswers;
    });
  
    setPlayerAnswers(prevPlayerAnswers => [...prevPlayerAnswers, ...newPlayerAnswers]);
  }
  
  function handleClick(id){
    setGameParameters([...gameParameters, id]);
  }

  function toggleState(state){
    state(previousState => !previousState);
  }

  function resetGame() {
    setCategoryChoosen(false);
    setDifficultyChoosen(false);
    setIsClickable(false);
    setShowCorrectAnswers(false);
    setGameParameters([]);
    setQuestions([]);
    setDataArrays(data);
    setQuestionsOrder(0);
    setProgress(0);
    setCorrectAnswers([]);
    setPlayerAnswers([]);
    setIsGameOver(false);
    score = 0
  }

  const categoriesElements = (dataArrays.map( (arrays, index )=>
    <div id={`category-${index + 1}`}>
      {
        arrays.map(category =>
          < Category 
              name={category.name}
              id={category.id}
              key={category.id}
              handleClick={() => handleClick(category.id)}
              toggleState={() => toggleState(setCategoryChoosen)}
          />)
      }
    </div>)
  );

  const objectsEqual = (object1, object2) =>
    Object.keys(object1).length === Object.keys(object2).length 
        && Object.keys(object1).every(p => object1[p] === object2[p]);

  function getOccurrence(array, value) {
    let count = 0;
    array.forEach((v) => (v === value && count++));
    return score = count
  }  

  function handleFinalResult(){
    const result = []
    for(let i = 0; i < correctAnswers.length; i++){
       result.push(objectsEqual(correctAnswers[i].answer, playerAnswers[i].answer))
    };
    getOccurrence(result, true)
  }

  const questionsElement = questions?.map(quest =>
    <Game 
      q={quest.question}
      answers={quest.answers}
      isSelected={quest.isSelected}
      key={nanoid()}
      handleQuestions={handleQuestions}
      goNextQuestion={goNextQuestion}
    />)

return(
    <main>
     {
      !startButtonPressed && !categoryChoosen && !difficultyChoosen ?(
      <Home toggleState={() => toggleState(setStartButtonPressed)}/>
      ) :
      startButtonPressed && !categoryChoosen && !difficultyChoosen ? (  
      <section className='categories-container'>
        <h1 className="instructions-text">Choose category and difficulty and let's start the quiz</h1>
        {categoriesElements[0]}
        <h1 className='category-title'>Entertainment</h1>
        {categoriesElements[1]}
        <h1 className='category-title'>Sciences</h1>
        {categoriesElements[2]}
        <h1 className='category-title'>World</h1>
        {categoriesElements[3]}
        <h1 className='category-title'>Other</h1>
        {categoriesElements[4]}
      </section>
      ) : 
      startButtonPressed  && categoryChoosen && !difficultyChoosen ? (
      <div className="game-container">
        <h1 className="instructions-text">Choose category and difficulty and let's start the quiz</h1>
        <div className="difficulty-page">
          {levels.map((level) => (
            <Difficulty 
                toggleState={() => toggleState(setDifficultyChoosen)}
                handleClick={() => handleClick(level)}
                value={level.charAt(0).toUpperCase() + level.slice(1)}
                id={level}
                key={level}
                />
          ))}
        </div>
      </div> ) : 
      startButtonPressed  && categoryChoosen && difficultyChoosen && !isGameOver? (
        <div className="game-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          {questionsElement[questionsOrder]}
        </div>
        ): startButtonPressed  && categoryChoosen && difficultyChoosen && isGameOver && !showCorrectAnswers? 
        (
          <div>
          {handleFinalResult()}
          <Results score={score} outOf={correctAnswers.length} toggleState={() => toggleState(setShowCorrectAnswers)} resetGame={resetGame} />
        </div>
        ) : startButtonPressed  && categoryChoosen && difficultyChoosen && isGameOver && showCorrectAnswers ? (
        <div>
           {questions.map((quest) => (
            <CorrectAnswers q={quest.question} answers={quest.answers} key={nanoid()} />
          ))}
          <button className="button result" onClick={resetGame}>Play Again</button>
        </div>
        ) : null
     }
    </main>
  );
}
