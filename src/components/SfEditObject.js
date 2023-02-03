import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Row, Col, Divider, Input, InputNumber, Select} from "antd"; 
const { Option } = Select;
const { TextArea } = Input;

class SfEditObject extends SfComponent {

  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      
      this.editObject= props.editObject;   
      this.columns = this.world.columnsForType(this.editObject.type);            
           
      this.state = { curObject : this.editObject }; 
    
      this.getEditor = this.getEditor.bind(this);
    
      this.handleChangeInput = this.handleChangeInput.bind(this);
      this.handleChangeSelect = this.handleChangeSelect.bind(this);
      this.getEditor = this.getEditor.bind(this);      
    }
   

    componentDidUpdate(prevProps) 
    {
      if (this.props.editObject !== prevProps.editObject ) 
      {
        this.editObject= this.props.editObject;   
        this.columns = this.world.columnsForType(this.editObject.type);            
           
        this.setState( { curObject : this.editObject } );
      }
    }
   
    handleChangeInput(key,e) 
    {
      this.state.curObject[key] = e.target.value;
      this.setState( { curObject : this.state.curObject } );
    }

    handleChangeSelect(key,val) 
    {
      this.state.curObject[key] = val;
      this.setState( { curObject : this.state.curObject } );
    }
    
    getOptionsListType(coldef)
    {  
      let result = [];
   
      if (coldef.dataChooserType === "yes_or_no")
      {
        result.push( <Option value="no" key="no" >no</Option> ); 
        result.push( <Option value="yes" key="yes" >yes</Option> ); 
      }
      else
      {
        let objectsList = this.world.getObjectsByType(coldef.dataChooserType);      
        objectsList.forEach(  c => { 
          let fulltext = this.world.getFullText( c, coldef.dataChooserLabel);
          result.push( <Option value={c.id} key={c.id} >{fulltext}</Option> ); 
        })
      }
      
      return result;
    }
    
    getEditor(coldef)
    {
      let value = this.state.curObject[coldef.key];
      let key = coldef.key;
      let placeholdertext = this.getRscText("enter_val"); 

      switch(coldef.dataChooser)
      {
        case "none" :
          if (value === true)
          {
            value = "true";
          } else if (value === false)
          {
            value = "false";
          }
          break;
        case "text" :
          return <Input placeholder={placeholdertext} key={key} value={value} 
                                    onChange={(e)=>{this.handleChangeInput(key,e)}}/>;
        case "password" :
          return <Input placeholder={placeholdertext} key={key} value={value} 
                                    onChange={(e)=>{this.handleChangeInput(key,e)}}/>;
        case "textmultiline" :
          return <TextArea rows={4} placeholder={placeholdertext} key={key} value={value} 
                                    onChange={(e)=>{this.handleChangeInput(key,e)}}/>;     
        case "number" :
          return <InputNumber placeholder={placeholdertext} key={key} value={value} 
                                   onChange={(e)=>{this.handleChangeSelect(key,e)}}/>;
        case "select" :
          return <Select value={value}  style={{ width: '100%' }} 
                                  onChange={(e)=>{this.handleChangeSelect(key,e)}} >
                    {this.getOptionsListType(coldef)}           
                 </Select>;
        case "imageurl" :
          return <Input placeholder={placeholdertext} key={key} value={value}
                                 onChange={(e)=>{this.handleChangeInput(key,e)}} />;
       default:
          break;
      }     

      let obj = this.world.getCalculatedValue(coldef.dataCalculated, this.state.curObject);
      if (obj !== null) {
        value = String(obj);
      }

      return <>{value}</>;
    }

    render()
    {   
      return ( <>   
                <Divider />
                {this.columns.map((coldef, key) => {
                                  return (
                                    <Row gutter={[24, 16]} key={coldef.key} >
                                    <Col flex="100px">{coldef.title}</Col> 
                                    <Col flex="auto">{this.getEditor(coldef)}</Col>
                                    </Row>
                                  );
                                })}                
               </>              
         );
    }
}

export default SfEditObject;
