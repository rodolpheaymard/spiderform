import React from 'react';
import SfComponent from './SfComponent';
import { GlobalContext } from "./GlobalContext";
import { Image , List } from "antd"; 


class SfWizardResult extends SfComponent {
    static contextType = GlobalContext;  // global context for session  
 
    constructor(props) {
      super(props);
        
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
      // builds list of explanations 
      let listExplanations =  [];
      let selectImage = (score) => { if (score <0) return "/redarrow.png"; else  return "/greenarrow.png"; };
      this.state.data.scores.forEach(element => { listExplanations.push( <div> <Image src={selectImage(element.score)}
                                                                                width="20px" heigth="18px"/>
                                                                                {element.explanation}   </div>); });
      let blockExplanations = <></>;
      let formObj = this.world.getObjectById(this.state.form);
      if (this.isOk(formObj) && formObj.with_explanations === "yes" )
      {
          blockExplanations = <div> Your points come from those reasons : <br/> 
                              <List dataSource={listExplanations} renderItem={(item) => (<List.Item>{item}</List.Item>)} /> </div>  ;
      }

      // builds list of details (questions/answers/points)
      let listDetails =  [];        
      this.state.data.userchoices.forEach(uc =>{ listDetails.push( <div><div>{uc.userquestion.text}</div> 
                                                                         <div>{uc.userchoice.text}</div>
                                                                         <div>{uc.score} {this.getRscText("pts")}</div> </div> ) });
      let blockDetails = <></>;
      if (this.isOk(formObj) && formObj.with_details === "yes" )
      {
        blockDetails = <div> Your answers : <br/> 
                          <List dataSource={listDetails} renderItem={(item) => (<List.Item>{item}</List.Item>)} /> </div>  ;
      }

      return (<>      
                <div> {this.state.data.concept.explanation} </div> 
                <div> {blockExplanations} </div>
                <div> {blockDetails} </div>

             
              </> );
    }
}
 
export default SfWizardResult;