import React from 'react';
import './App.css';
import SfFormPage from './components/SfFormPage';
import {GlobalContext} from "./components/GlobalContext";


export default class App extends React.Component {


  GetData(localStorageKey) {
    let str = localStorage.getItem(localStorageKey);
    if (str !== null)
    {
      try  {
        return JSON.parse(str);
      }
      catch {
        return null;
      }
    }
    return  null ;
  }
  
  SetData(localStorageKey, value) {
    return localStorage.setItem(localStorageKey, JSON.stringify(value));
  }

  setSession = (session) => {
    this.setState({ session });
    this.SetData('spiderformsession',session);
  };

  state = {
    session: this.GetData('spiderformsession'),
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
