import React from 'react';
import './App.css';
import SfFormPage from './components/SfFormPage';
import {GlobalContext} from "./components/GlobalContext";


export default class App extends React.Component {

  //Let's declare our main state here, it would be global, and can be shared!
  setSession = (session) => {
    this.setState({ session });
  };

  state = {
    session: null,
    setSession: this.setSession,
  }
 
  render(){
    return(
      <GlobalContext.Provider value={this.state}>
          <SfFormPage />
      </GlobalContext.Provider>
    )
  }
}
