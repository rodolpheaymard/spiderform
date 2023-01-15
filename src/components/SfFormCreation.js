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

      this.state = {  data : null , currObjType : "form" };

      this.onDataLoaded= this.onDataLoaded.bind(this);
      this.onErrorDataLoaded= this.onErrorDataLoaded.bind(this);
      this.buildDataSet= this.buildDataSet.bind(this);    
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
      this.setState({ data : this.buildDataSet(null) });     
    }

    buildDataSet(response)
    {
      let dataSet = new Map();
      if (response !== null)
      {     

        this.world.getTypesList().forEach( typ => {
          let objs = [];
          response.objects.forEach( obj => {  if (obj.type === typ.value) { objs.push(obj); } });
          dataSet.set(typ.value, objs);          
        })
      
      }
      return dataSet;
    }

    onDataLoaded(response)
    { 
      if (response !== null)
      {        
        let dataSet = this.buildDataSet(response);
        this.setState({ data: dataSet });
      }
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
                   <SfListOfObjects world={this.world} objectType={this.state.currObjType} dataMap={this.state.data}/>
                           
                </>              
         );

      
    }
}

export default SfFormCreation;