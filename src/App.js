import React, { Component } from 'react';
import './App.css';

import Calendar from './components/calendar/calendar';


const style = {
  position: "relative",
  margin: "50px auto",
  width: "300px"
}

class App extends Component {
  onDaySelect = (e, momentOfDay) => {
    alert(momentOfDay.format("D.M.Y"));
  }
  
  render() {
    return (
      <div className="App">
        <Calendar style={style} onDaySelect={(e, day)=> this.onDaySelect(e, day)}/>     
      </div>
    );
  }
}

export default App;