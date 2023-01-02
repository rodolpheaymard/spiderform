import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Table , Card, Button } from "antd"; 



class SfListOfObjects extends SfComponent {

  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;      
      this.objectType = props.objectType;   

      this.state = {  objects : props.objectsList , 
                      curObject : null };

      this.columns = this.world.columnsForType(this.objectType);      

      
      this.handleAdd = this.handleAdd.bind(this);
      this.onObjectAdded = this.onObjectAdded.bind(this);
      this.onErrorObjectAdded = this.onErrorObjectAdded.bind(this);
    }

    componentDidUpdate(prevProps) {
      if (this.props.objectsList !== prevProps.objectsList) {
        this.setState( { objects : this.props.objectsList } );
      }
    }
   

    handleAdd(event) 
    {
      event.preventDefault();
  
      // var { addnewform_name } = document.forms["addnewform"];
      // let newformname = addnewform_name.value;

      this.world.addObject( { id : "no_idea", type : this.objectType  } , this.onObjectAdded, this.onErrorObjectAdded);
    }

    onErrorObjectAdded(response)
    {
    }

    onObjectAdded(newobj)
    { 
      this.setState({ objects: [...this.state.objects, newobj] ,
                      curObject : newobj}) ;
    }
    

    render()
    {
      
      return ( <>      
               <Card title={this.objectType}  className="sfAdminCard">
               <Table dataSource={this.state.objects} columns={this.columns} pagination={false} />              
               <Button onClick={this.handleAdd} type="primary" className="sfBtnAdd" > Add a {this.objectType} </Button>
               </Card>

               
               </>              
         );
    }
}

export default SfListOfObjects;