import React from 'react';
import SfComponent from './SfComponent';
import { Image , List } from "antd"; 


class SfWizardResult extends SfComponent {

    constructor(props) {
      super(props);
      this.world = props.world;  
      this.state = { data : props.data , form :props.form } ;
      }

    componentDidMount() 
    {
    }
  
    componentDidUpdate(prevProps) 
    {
      if (this.props.data !== prevProps.data
           || this.props.form !== prevProps.form) 
      {
        this.setState( {data : this.props.data  , form : this.props.form } );
      }
    }
    


    render()
    {
      let selectImage = (score) => { if (score <0) return "/redarrow.png"; else  return "/greenarrow.png"; };

      let listExplanations =  [];
      this.state.data.scores.forEach(element => { listExplanations.push( <div> <Image src={selectImage(element.score)  } width="20px" heigth="18px"/>
                                                                           {element.explanation}   </div>); });

      let blockExplanations = <></>;
      let formObj = this.world.getObjectById(this.state.form);
      if (this.world.isOk(formObj) && formObj.with_explanations === "yes" )
      {
          blockExplanations = <div>   Your points come from those reasons : <br/> 
                                    <List dataSource={listExplanations} renderItem={(item) => (<List.Item>{item}</List.Item>)} /> </div>  ;
      }

      return (<>      
                <div> {this.state.data.concept.explanation} </div> 
                <div> {blockExplanations} </div>
              </> );
    }
}
 
export default SfWizardResult;