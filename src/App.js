import React, {useState, useEffect} from 'react';
import './App.css';

function App(props) {
  const [sessionTime, setSessionTime] = useState(props.intialSessionTime);
  const [breakTime, setBreakTime] = useState(props.initialBreakTime);
  const [displayTime, setDisplayTime] = useState(props.intialSessionTime);
  const [intervalId,setIntervalId]=useState(undefined);
  const [isPause,setIsPause]=useState(false);
  const [onBreak,setOnBreak]=useState(false);
  const [lastSession, setLastSession] = useState();
  const [lastBreak, setLastBreak] = useState();

  useEffect(() => {
    if (displayTime === 0) {
      playBreakSound();

      if (!onBreak) {
        setOnBreak(true);
        setDisplayTime(breakTime);
        setSessionTime(lastSession);
      } else {
        setOnBreak(false);
        setDisplayTime(sessionTime);
        setBreakTime(lastBreak);
      }
    }
  }, [displayTime])

  const playBreakSound = () => {
    let beepAudio = document.getElementById("beep");
    beepAudio.play();
    beepAudio.currentTime = 0;
  }

  const pauseBreakSound = () => {
    let beepAudio = document.getElementById("beep");
    beepAudio.pause();
    beepAudio.currentTime = 0;
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? `0${minutes}` : minutes) + ":" +
      (seconds < 10 ? `0${seconds}` : seconds)
    );
  };

  const handleBreakIncrement = () => {
    setBreakTime((prev) => {
      if (prev === 3600) return prev;
      setLastBreak(prev+60);
      return prev + 60;
    })
  };
  const handleBreakDecrement = () => {
    setBreakTime((prev) => {
      if (prev === 60) return prev;
      setLastBreak(prev-60);
      return prev - 60;
    })
  };
  const handleSessionIncrement = () => {
    if (isPause) return;
    setSessionTime((prev) => {
      if (prev === 3600) return prev;
      setLastSession(prev+60);
      setDisplayTime(prev+60);
      return prev + 60;
    });
  };
  const handleSessionDecrement = () => {
    setSessionTime((prev) => {
      if (prev === 60) return prev;
      setLastSession(prev-60);
      setDisplayTime(prev-60);
      return prev - 60;
    })
  };
 
  const controlTime = () => {
    setLastSession(sessionTime);
    setLastBreak(breakTime);
    if(intervalId){
      setIntervalId(undefined);
      setIsPause(false);
      clearInterval(intervalId);
    }else{
      setIntervalId(setInterval(() => {
        setDisplayTime((prevTime) => {
          if (prevTime === 0) return;
          return prevTime-=1;
        });
      }, 1000));
      setIsPause(true);
    }    
  }

  const handleReset = () => {
    pauseBreakSound();
    if(intervalId){
      clearInterval(intervalId);
      setIntervalId(undefined);
      setIsPause(false);
    }
    setOnBreak(false);
    setBreakTime(props.initialBreakTime);
    setSessionTime(props.intialSessionTime);
    setDisplayTime(props.intialSessionTime);
  }

  return (
    <div className="App">
      <div className="app-title">
        FreeCodeCamp Pomodoro Clock
      </div>

      <div className="grid-container">
        <div id="break-label" className="grid-item">
          Break Length <br/> <br/>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
            <span id="break-length">
              {Math.floor(breakTime/60)}
            </span>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
        </div>

        <div id="session-label" className="grid-item">
          Session Length <br/> <br/>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
            <span id="session-length">
            {Math.floor(sessionTime/60)}
            </span>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
        </div>
      </div>
    
      <div className="timer-title">
        👇 {onBreak ? "Take a Break, Dude" : "It's time to Work"} 👇
      </div>

      <div className="timer-container">
        <div id="timer-label">
          {onBreak ? "Break" : "Session"}
            <div id="time-left">
              {formatTime(displayTime)}
            </div>
        </div>
      </div>

      <div className="start_stop_buttons">
            <button id="start_stop" onClick={controlTime}>
              {isPause ? 
                <i className="fas fa-pause"></i>
              : 
                <i className="fas fa-play"></i>
              }
            </button>

            <button id="reset" onClick={handleReset}>
              <i className="fas fa-sync" aria-hidden="true"></i>
            </button>
        </div>
      
      <audio src="./beep.mp3" id="beep"></audio>
    </div>
  );
}
App.defaultProps={
  intialSessionTime:25*60,
  initialBreakTime:5*60
}
export default App;
