import React from "react";
import { Select, Space } from 'antd';
import SfComponent from "./SfComponent";
import SfListOfObjects from "./SfListOfObjects";


import { GlobalContext } from "./GlobalContext";



class SfFormCreation extends SfComponent {
  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;

      this.state = {
        currObjType : "",
        statusMessage : "loading data"  
      };

      this.onDataLoaded= this.onDataLoaded.bind(this);
      this.onErrorDataLoaded= this.onErrorDataLoaded.bind(this);
      this.handleChooseType= this.handleChooseType.bind(this);          
    }

    componentDidMount()
    { 
        this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded)
    }

    onErrorDataLoaded(response)
    {
      this.setState({ statusMessage : "error loading data"});
    }    

    onDataLoaded(response)
    {      
      if (this.context.session != null)
      {
        this.setState({ 
          statusMessage : "data loaded",
          currObjType : this.context.session.chosenObjectType });
      }      
    }

    handleChooseType(chosenValue) 
    {
      if (this.context.session != null)
      {
        let newsession = this.context.session;
        newsession.chosenObjectType = chosenValue;
        this.context.setSession(newsession);
      }
       
      this.setState({ currObjType : chosenValue });  
    }

    render()
    {
      //console.log("render  form creation " + this.state.currObjType );
      return ( <>
                   <div className="sfPageTitle"> Administration Back-Office </div>

                  <Space size="large">
                    <Select   style={{ width: 120 }}  onChange={this.handleChooseType}
                              defaultValue={this.state.currObjType}  
                              value={this.state.currObjType}  
                              options={this.world.getTypesList()} />
                    info : {this.state.statusMessage}                    
                  </Space>
                  <SfListOfObjects world={this.world} objectType={this.state.currObjType} />
                </>              
         );

      
    }
}

export default SfFormCreation;