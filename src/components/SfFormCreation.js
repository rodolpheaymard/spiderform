import React from "react";
import { Select } from 'antd';
import SfComponent from "./SfComponent";
import SfListOfObjects from "./SfListOfObjects";


import { GlobalContext } from "./GlobalContext";



class SfFormCreation extends SfComponent {
  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;

      this.state = { currObjType : "form" };

      this.onDataLoaded= this.onDataLoaded.bind(this);
      this.onErrorDataLoaded= this.onErrorDataLoaded.bind(this);
      this.handleChooseType= this.handleChooseType.bind(this);          
    }

    
    componentDidMount()
    {
        const context = this.context;
        this.setState({session : context.session});   

        this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded)
    }


    onErrorDataLoaded(response)
    {
    }    

    onDataLoaded(response)
    {       
    }

    handleChooseType(chosenValue) 
    {
      //console.log("handleChooseType " + chosenValue );
      this.setState({ currObjType : chosenValue });  
    }

    render()
    {
      //console.log("render  form creation " + this.state.currObjType );
      return ( <>
                   <div className="sfPageTitle"> Administration Back-Office </div>

                   <Select   style={{ width: 120 }}  onChange={this.handleChooseType}
                             defaultValue={this.state.currObjType}  
                             options={this.world.getTypesList()} />
                   <SfListOfObjects world={this.world} objectType={this.state.currObjType} />
                           
                </>              
         );

      
    }
}

export default SfFormCreation;