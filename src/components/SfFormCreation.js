import React from "react";
import SfComponent from "./SfComponent";
import SfListOfObjects from "./SfListOfObjects";


import { GlobalContext } from "./GlobalContext";



class SfFormCreation extends SfComponent {
  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;

      this.state = {  loaded : false,
                        forms : [] ,
                        concepts : [],
                        questions : [],
                        choices : []  };


      this.onDataLoaded= this.onDataLoaded.bind(this);
      this.onErrorDataLoaded= this.onErrorDataLoaded.bind(this);
    
    }

    componentDidMount()
    {
        const context = this.context;
        this.setState({session : context.session});   

        this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded)
    }


    onErrorDataLoaded(response)
    {
      this.setState({ loaded : false,
                      forms : [] ,
                      concepts : [],
                      questions : [],
                      choices : [] });     
    }

    onDataLoaded(response)
    { 
      if (response !== null)
      {
        this.setState({ forms : response.forms ,
                        concepts : response.concepts,
                        questions : response.questions,
                        choices : response.choices });
      }
    }


    render()
    {
      return ( <>
                   <div className="sfPageTitle"> Administration Back-Office </div>
                   <SfListOfObjects world={this.world} objectType="concept" objectsList={this.state.concepts}/>
                   <SfListOfObjects world={this.world} objectType="form" objectsList={this.state.forms}/>
                   <SfListOfObjects world={this.world} objectType="question" objectsList={this.state.questions}/>                   
                   <SfListOfObjects world={this.world} objectType="choice" objectsList={this.state.choices}/>                   
                </>              
         );
    }
}

export default SfFormCreation;