import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Table , Card, Button  , Space} from "antd"; 



class SfListOfObjects extends SfComponent {

  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;      
      this.objectType = props.objectType;   
      
      let objlist = [];
      if (props.dataMap !== null)
      {
        objlist = props.dataMap.get(props.objectType);
      }
      if (objlist === null || objlist === undefined)
      {
        objlist = [];
      }

      this.state = {  objects : objlist, 
                      curObject : null }; 

      this.columns = this.world.columnsForType(this.objectType);            
      
      this.handleAdd = this.handleAdd.bind(this);
      this.onObjectAdded = this.onObjectAdded.bind(this);
      this.onErrorObjectAdded = this.onErrorObjectAdded.bind(this);
      this.handleEdit = this.handleEdit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.onObjectDeleted = this.onObjectDeleted.bind(this);
      this.onErrorObjectDeleted = this.onErrorObjectDeleted.bind(this);
     }

    componentDidUpdate(prevProps) {
      if (this.props.dataMap !== prevProps.dataMap ||  this.props.objectType !== prevProps.objectType ) 
      {
        this.objectType = this.props.objectType;
        this.columns = this.world.columnsForType(this.objectType);            
    
        let objlist = this.props.dataMap.get(this.objectType);
        if (objlist === null || objlist === undefined)
        {
          objlist = [];
        }
        this.setState( { objects : objlist} );
      }
    }
   

    handleAdd(event) 
    {
      event.preventDefault();
  
      // var { addnewform_name } = document.forms["addnewform"];
      // let newformname = addnewform_name.value;

      // console.log("listofobjects handleAdd length = " + this.state.objects.length);

      this.world.addObject( { id : "", type : this.objectType  } , this.onObjectAdded, this.onErrorObjectAdded);
    }

    onErrorObjectAdded(response)
    {
      // console.log("listofobjects onErrorObjectAdded ");
    }

    onObjectAdded(newobj)
    { 
      // console.log("listofobjects onObjectAdded length = " + this.state.objects.length);
      let found =  this.state.objects.findIndex( e =>  (e.id === newobj.id) ) ;
      // console.log("listofobjects onObjectAdded find id  result = " + found);

      if (found === -1)
      {
        this.setState({ objects: [...this.state.objects, newobj] ,
                        curObject : newobj}) ;
      }
      else
      {
        this.setState({ curObject : newobj}) ;
      }

      // console.log("listofobjects onObjectAdded length after = " + this.state.objects.length);
    }
    
    handleEdit(obj) 
    {
    }

    handleDelete(obj) 
    {
      this.world.deleteObject( obj , this.onObjectDeleted, this.onErrorObjectDeleted);
    }
 
    onErrorObjectDeleted(response)
    {
    }

    onObjectDeleted(delobj)
    { 
      let found =  this.state.objects.findIndex( e => (e.id === delobj.id) ) ;
      if (found !== -1)
      {
        let newlist = this.state.objects.map((x) => x); 
        newlist.splice(found,1);
        this.setState({ objects: newlist}) ;
      }
    }

    render()
    {
      //console.log("listofobjects onObjectAdded render , length = " + this.state.objects.length);
      let globalColumns = this.columns.map((x) => x); // to duplicate the list
      globalColumns.push({ title : "Actions" , key : "__actions" , dataIndex : "__actions",
                            render : (_, record) => (
                              <>
                              <Space>
                                <Button onClick={()=> this.handleEdit(record)}  type="primary" className="sfBtnEdit" key={record.id}>Edit</Button>
                                <Button onClick={()=> this.handleDelete(record)} type="primary" className="sfBtnDelete" key={record.id}>Delete</Button>
                              </Space>
                              </>
                              )});

      return ( <>      
               <Card title={this.objectType}  className="sfAdminCard">
               <Table dataSource={this.state.objects} columns={globalColumns} pagination={false} rowKey="id" />              
               <Button onClick={this.handleAdd} type="primary" className="sfBtnAdd" > Add a {this.objectType} </Button>
               </Card>

               
               </>              
         );
    }
}

export default SfListOfObjects;