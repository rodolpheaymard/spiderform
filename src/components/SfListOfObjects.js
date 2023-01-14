import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Table, Card, Button, Space, Modal} from "antd"; 
import SfEditObject from "./SfEditObject";



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
                      curObject : null,
                      editing : false }; 

      this.columns = this.world.columnsForType(this.objectType);            
      
      this.handleAdd = this.handleAdd.bind(this);
      this.onObjectAdded = this.onObjectAdded.bind(this);
      this.onErrorObjectAdded = this.onErrorObjectAdded.bind(this);
      
      this.handleEdit = this.handleEdit.bind(this);
      this.handleEditOk = this.handleEditOk.bind(this);
      this.onObjectSaved = this.onObjectSaved.bind(this);
      this.onErrorObjectSaved = this.onErrorObjectSaved.bind(this);
      this.handleEditCancel = this.handleEditCancel.bind(this);

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
      let duplicatedObj = { ...obj };
      this.setState({curObject : duplicatedObj , editing : true });
    }

    handleEditOk() 
    {
      this.world.saveObject( this.state.curObject, this.onObjectSaved, this.onErrorObjectSaved);
      this.setState({editing : false });
    }

    onErrorObjectSaved(response)
    {
       console.log("listofobjects onErrorObjectSaved ");
    }

    onObjectSaved(newobj)
    { 
      console.log("listofobjects onObjectSaved ");
    }
    
    handleEditCancel() 
    {
      this.setState({editing : false });
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
      //  we need to remove the object from the objects' list in the state
      let found =  this.state.objects.findIndex( e => (e.id === delobj.id) ) ;
      if (found !== -1)
      {
        let newlist = this.state.objects.map((x) => x); // this code duplicates the list
        newlist.splice(found,1);
        this.setState({ objects: newlist}) ;
      }
    }

    render()
    {
      // console.log("listofobjects onObjectAdded render , length = " + this.state.objects.length);
      let globalColumns = this.columns.map((x) => x); // to duplicate the list
      globalColumns.push({ title : "Actions" , 
                           key : "__actions" , 
                           dataIndex : "__actions",
                           render : (_, record) => (
                              <>
                              <Space>
                                <Button onClick={()=> this.handleEdit(record)}  type="primary" className="sfBtnEdit" key={record.id + "_edit"}>Edit</Button>
                                <Button onClick={()=> this.handleDelete(record)} type="primary" className="sfBtnDelete" key={record.id + "_delete"}>Delete</Button>
                              </Space>
                              </>
                              )});

      return ( <>      
               <Card title={this.objectType}  className="sfAdminCard">
               
               <Table dataSource={this.state.objects} columns={globalColumns} pagination={false} rowKey={ record => record.id} />              
               
               <Button onClick={this.handleAdd} type="primary" className="sfBtnAdd" > Add a {this.objectType} </Button>
               
               
               <Modal open={this.state.editing} title="Edit" onOk={this.handleEditOk} onCancel={this.handleEditCancel}
                      footer={[ <Button key="cancel" onClick={this.handleEditCancel}>Cancel</Button>,
                                <Button key="save" type="primary" onClick={this.handleEditOk}>Save</Button>
                              ]}>
                 <SfEditObject world={this.world} editObject={this.state.curObject}/>
               </Modal>               
               </Card>             
               </>              
         );
    }
}

export default SfListOfObjects;

//const columns: ColumnsType<DataType> = [
//  {
//    title: 'Name',
//    dataIndex: 'name',
//    key: 'name',
//    filters: [
//      { text: 'Joe', value: 'Joe' },
//      { text: 'Jim', value: 'Jim' },
//    ],
//    filteredValue: filteredInfo.name || null,
//    onFilter: (value: string, record) => record.name.includes(value),
//    sorter: (a, b) => a.name.length - b.name.length,
//    sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
//    ellipsis: true,
//  },
  