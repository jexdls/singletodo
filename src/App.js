import './App.css';
import React, { useState } from 'react';
import {Col, Fade} from 'react-bootstrap';

function App() {
  const [mode, setMode] = useState("show");
  const [list, setList] = useLocalStorage('listSPECIALforTODOcodedzxc',[]);
  const [fadeIn,setFadeIn] = useState(true);
  const randListIndex = Math.floor(Math.random() * list.length);

  return (
    <Col sm={12} md={7} lg={6} xl={4} className="x_grid_master">
        <Title fadeIn={fadeIn} setFadeIn={setFadeIn} mode={mode} setMode={setMode} list={list}/>
        <Main fadeIn={fadeIn} setFadeIn={setFadeIn} mode={mode} setMode={setMode} list={list} setList={setList} randListIndex={randListIndex}/>
    </Col>
  );
}

function Title(props){
  let titleButtonTxt = props.mode==="show"? "+" : "<";
  let titleText = props.mode==="show"? "To Do" : "Add to my list";
  return (
      <div className="x_Title">
        <Fade appear={true} in={props.fadeIn}>
          <button className="x_grid_title_button" 
            onClick={() => {
              props.setFadeIn(false);
              setTimeout(function(){props.setMode(prev => prev==="show"? "add":"show")}, 250);
              setTimeout(function(){props.setFadeIn(true)},250);
              }}
            disabled={props.list.length===0}>
            {titleButtonTxt}
          </button>
        </Fade>
        <Fade appear={true} in={props.fadeIn}>
          <h1 className="x_grid_title_title">{titleText}:</h1>
        </Fade>
      </div>
    );
}

function Main(props){
  const[checkBox, setCheckBox] = useState(false);
  const[isCommitted, setIsCommitted] = useState(false);
  const[mainText, setMainText] = useState("");
  let statusIcon = isCommitted? "✓" : "";

  let commitButton = (
    <button className="x_grid_main_commit"
      onClick={()=> {
        setIsCommitted(!isCommitted);
        setTimeout(function(){setIsCommitted(false)}, 1500);
        props.setList(prev => [...prev,mainText]);
        setMainText("");
      }}disabled={isCommitted || mainText===""}>
        Commit
      </button>
  );

  function switchMode(){
      props.setFadeIn(false);
      setTimeout(function(){props.setMode("add")}, 1000);
      props.setFadeIn(true);
  }

  let showText = (
    <div className="x_Main1">
        <input 
          className="x_grid_main_checkbox"
          checked={checkBox}
            type="checkbox" 
            onChange={() => {
              setCheckBox(true);
              setTimeout(function(){setCheckBox(false)},2000);
              props.setList(prev => prev.slice(0,props.randListIndex).concat(prev.slice(props.randListIndex+1)));
            }}
            disabled={checkBox}/>
        <span className="x_grid_main_note">
          {props.list.length===0?
            switchMode():
            props.list[props.randListIndex]}
        </span>
    </div>
  );

  let addText = (
    <div className="x_Main2">
        <input 
          className="x_grid_main_input"
          sm="12"
          onChange={(event) => setMainText(event.target.value)}
          value={mainText}
          />
      
        <span id="green-check">
          {statusIcon}
        </span>
        {commitButton}
    </div>
  );
  
  return (
        <Fade in={props.fadeIn}>
          {props.mode==="show"?showText:addText}
        </Fade>
    );
}







// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}


export default App;
