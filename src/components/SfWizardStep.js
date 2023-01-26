import React from 'react';
import SfComponent from './SfComponent';
import { Radio , Checkbox , Space } from "antd"; 


class SfWizardStep extends SfComponent {

    constructor(props) {
      super(props);
      this.world = props.world;  
    
      this.state = { question :  props.question , 
                      singlechoice : null } ;
      this.loadQuestionData(props.question);

      this.handleChoose = this.handleChoose.bind(this);    
      this.handleMultiChoose = this.handleMultiChoose.bind(this);    
    }

    componentDidMount() 
    {
    }
  
    componentDidUpdate(prevProps) 
    {
      if (this.props.question !== prevProps.question ) 
      {
        this.setState({ question :  this.props.question });
        this.loadQuestionData(this.props.question);
      }
    }

    loadQuestionData(question)
    {
      this.sequence = null;  
      this.choices = [];      
      if (question !== null && question !== undefined )
      {
        this.sequence = this.world.getObjectById(question.sequence);
        this.choices = this.world.selectObjects("choice","question",question.id);
      }      
    }

    
    handleChoose(event) 
    {
      event.preventDefault();
      this.setState( { singlechoice : event.target.value });

    }

    handleMultiChoose(event) 
    {
      event.preventDefault();
      // event.target.checked;
      this.setState( { singlechoice : event.target.value });

    }

    render()
    {

      let choicesBlock = <></>;

      if (this.state.question !== null && this.state.question !== undefined)
      {
        if (this.state.question.multichoice === "yes")
        {
          let othis = this;
          choicesBlock = <>  
             <Space direction="vertical">
               {this.choices.map( function(c , i) { return  <Checkbox onChange={othis.handleMultiChoose} value={c.id} key={c.id}>{c.text}</Checkbox> ;})}
             </Space>
           </>;
        }
        else
        {
          choicesBlock = <>
              <Radio.Group onChange={this.handleChoose} value={this.state.singlechoice}>
                <Space direction="vertical">
                  {this.choices.map( function(c , i) { return  <Radio value={c.id} key={c.id}>{c.text}</Radio> ;})}
                </Space>
              </Radio.Group>
          </>;
        }               
      }
      
      return (<>
               <div>sequence : {this.sequence !== null && this.sequence !== undefined ? this.sequence.name : ""}</div>
               <div>question : {this.state.question !== null && this.state.question !== undefined ? this.state.question.text : ""}</div>
               <div>
               {choicesBlock}
               </div>
              </>  );
    }
}
 
export default SfWizardStep;