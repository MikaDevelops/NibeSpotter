import './App.css';
import React from 'react';
import axios from 'axios';
import Alert from './components/Alert';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tokenValid: null
    };
    this.checkTokenValid = this.checkTokenValid.bind(this);
  }

  componentDidMount(){
    this.checkTokenValid();
  }

  checkTokenValid(){
    axios.get('http://localhost:3001/checktokenstatus').then((res)=>{
      this.setState({tokenValid: res.data.tokenIsValid});
    })
    .catch(err=>{
      console.log('Error message (checkTokenValid): ' + err.message);
    });
  }

  render(){
  return (
    <div className="App">
      <header className="App-header">
       
        <Alert tokenValid={this.state.tokenValid} />
        
      </header>
    </div>
    );
  }
}

export default App;
