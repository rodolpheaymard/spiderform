import React from 'react';
import './App.css';
import SfFormPage from './components/SfFormPage';
import {GlobalContext} from "./components/GlobalContext";
import MdlWorld from './components/MdlWorld';

export default class App extends React.Component {

  constructor()
  {
    super();
    this.world = new MdlWorld();

    this.state = {
      session: this.GetData('spiderformsession'),
      setSession: this.setSession,
    }
    
    this.server_url =process.env.REACT_APP_SERVER_URL;

  }

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

 
  render(){
    return(
      <GlobalContext.Provider value={this.state}>
          <SfFormPage world={this.world}/>
      </GlobalContext.Provider>
    )
  }
}
