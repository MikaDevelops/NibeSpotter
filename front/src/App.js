import './App.css';
import React from 'react';
import axios from 'axios';
import Alert from './components/Alert';
import Air from './components/Air';

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      sysInfoUpdateInterval: 180,
      tokenValid: null,
      systemInfo: {
        fanSpeed: "no info",
        exhaustAir: "no info",
        extractAir: "no info",
        supplyAir: "no info"
      }
    };

    this.checkTokenValid = this.checkTokenValid.bind(this);
    this.updateSystemInfo = this.updateSystemInfo.bind(this);
  }

  componentDidMount(){
    this.checkTokenValid();
    this.updateSystemInfo();
  }

  checkTokenValid(){
    axios.get('http://localhost:3001/checktokenstatus').then((res)=>{
      this.setState({tokenValid: res.data.tokenIsValid});
    })
    .catch(err=>{
      console.log('Error message (checkTokenValid): ' + err.message);
    });
  }

  updateSystemInfo(){
    axios.get('http://localhost:3001/getsystemstatus').then((res)=>{
      let newdata={};
      if (res.data.systemStatus === 'no info available') {
        newdata = {fanSpeed: 'no info', exhaustAir: 'no info', extractAir: 'no info', supplyAir: 'no info'};
      }
      else {
        newdata = {
        fanSpeed: res.data.systemStatus[1].parameters[0].displayValue ? res.data.systemStatus[1].parameters[0].displayValue : 'no info',
        exhaustAir: res.data.systemStatus[1].parameters[1].displayValue ? res.data.systemStatus[1].parameters[1].displayValue : 'no info',
        extractAir: res.data.systemStatus[1].parameters[2].displayValue ? res.data.systemStatus[1].parameters[2].displayValue : 'no info',
        supplyAir: res.data.systemStatus[1].parameters[3].displayValue ? res.data.systemStatus[1].parameters[3].displayValue : 'no info',
      };
    }
      this.setState({systemInfo: newdata});
      if (this.state.sysInfoUpdateInterval > 0) setTimeout(()=>{this.updateSystemInfo()}, this.state.sysInfoUpdateInterval*1000);
    });
  }

  render(){

  return (
    <div className="App">
      <header className="App-header">
        <Alert tokenValid={this.state.tokenValid} />
      </header>

      <Air 
        airSupplyTemp={this.state.systemInfo.supplyAir}
        airExtractTemp={this.state.systemInfo.extractAir}
        airExhaustTemp={this.state.systemInfo.exhaustAir}
        fanSpeed={this.state.systemInfo.fanSpeed}
          />
    </div>
    );
  }
}

export default App;
/*
           airSupplyTemp={this.state.systemInfo.systemStatus[1].parameters[3].displayValue}
          airExtractTemp={}
          airExhaustTemp={}
          fanSpeed={}
*/