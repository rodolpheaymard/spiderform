import React from 'react';
import SfComponent from './SfComponent';
import { Radio , Checkbox , Space, Button, Card } from "antd"; 


class SfWizardStep extends SfComponent {

    constructor(props) {
      super(props);
   
      this.onValidated = props.onValidated;
      this.state = { user : props.user,
                     form : props.form,
                     question :  props.question , 
                     singlechoice : null,
                     multichoice : new Map(),
                     user_answer : null } ;

      this.loadQuestionData(props.question);

      this.handleChoose = this.handleChoose.bind(this);    
      this.handleMultiChoose = this.handleMultiChoose.bind(this);    
      this.handleValidate = this.handleValidate.bind(this);   
    
      this.onAnswerCreated = this.onAnswerCreated.bind(this);   
      this.onErrorAnswerCreated = this.onErrorAnswerCreated.bind(this);         
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

    handleMultiChoose(checkedValues) 
    {
      let new_mchoice = new Map();
      checkedValues.forEach( cid => new_mchoice.set(cid,true));
  
      this.setState( { multichoice : new_mchoice });
    }
    
    handleValidate(event)
    {
      let userAnswer = { id :'', type : 'user_answer' , deleted : false };        

      userAnswer.user = this.state.user;
      userAnswer.form = this.state.form;
      if (this.state.question !== null)
      {
        userAnswer.sequence = this.state.question.sequence;
        userAnswer.question = this.state.question.id;  
      }

      if (this.state.singlechoice !== null)
      {
        userAnswer.choices = [ this.state.singlechoice ];
      }
      else
      {
        userAnswer.choices = [];
        this.state.multichoice.forEach( (value, key, map) => { if (value === true) { userAnswer.choices.push(key); } } );
      }
      this.world.addObject(userAnswer,this.onAnswerCreated,this.onErrorAnswerCreated);
      this.onValidated(userAnswer);
      this.setState({singlechoice : null , multichoice : new Map()});
    }
    
    onErrorAnswerCreated(response)
    {    
    }    

    onAnswerCreated(response)
    {      
    }

    render()
    {
      let choicesBlock = <></>;
      let buttonValidate = <></>;
       
      let isAnswered = (othis) => { if (othis.state.singlechoice !== null)
                                      { return true; }
                                    if (othis.state.multichoice.size !== 0)
                                      { return true; }
                                    return false;
                                  };
      let isChosen = (othis, choiceId) =>  { if (othis.state.multichoice.get(choiceId)=== true) 
                                                { return "checked";}
                                              return "";
                                            };

      if (this.isOk(this.state.question))
      {
        if (this.state.question.multichoice === "yes")
        {
          let othis = this;
          choicesBlock = <>            
             <Space direction="vertical">             
              <Checkbox.Group    onChange={this.handleMultiChoose} >
               {this.choices.map( function(c , i) { 
                            if (isChosen(othis , c.id)) { return  <Checkbox value={c.id} key={c.id} checked >{c.text}</Checkbox> ;}
                            else { return  <Checkbox value={c.id} key={c.id}  >{c.text}</Checkbox> ;}
                          }) }
              </Checkbox.Group>
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
        
        if (isAnswered(this))
        {
          buttonValidate = <>
                          <Button onClick={this.handleValidate} type="primary" 
                                  className="sfBtnWizardValidate" > {this.getRscText("validate")} </Button>  
                          </>;          
        }
        else
        {
          buttonValidate = <>
                          <Button onClick={this.handleValidate} type="primary" disabled
                                  className="sfBtnWizardValidate" > {this.getRscText("validate")} </Button>  
                         </>;             

        }
      }
      return (<>      
               <Card title={this.sequence !== null && this.sequence !== undefined ? this.sequence.name : ""} 
                    className="sfWizardStep">

 
                  <Space className="sfWizardStepQuestion">
                  {this.state.question !== null && this.state.question !== undefined ? this.state.question.text : ""}
               
                  </Space>
                  <Space className="sfWizardStepChoices">
                  {choicesBlock}
                  </Space >


                  <Space className="sfWizardStepValidate">
                   {buttonValidate}                  
                   </Space>      
              </Card>
              </>  );
    }
}
 
export default SfWizardStep;