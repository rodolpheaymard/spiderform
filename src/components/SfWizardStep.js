import React from 'react';
import SfComponent from './SfComponent';
import { Radio , Checkbox , Space, Button, Card ,Row } from "antd"; 


class SfWizardStep extends SfComponent {

    constructor(props) {
      super(props);
   
      this.onValidated = props.onValidated;
      this.state = { user : props.user,
                     form : props.form,
                     question :  props.question , 
                     choices : [],
                     singlechoice : null,
                     multichoice : new Map(),
                     questionmessage : "",
                     mini : 0,
                     maxi : 0,
                     user_answer : null,
                     version : 0 } ;

      this.handleChoose = this.handleChoose.bind(this);    
      this.handleMultiChoose = this.handleMultiChoose.bind(this);    
      this.onChangeBoxCheck = this.onChangeBoxCheck.bind(this);    
      this.onChangeBoxUncheck = this.onChangeBoxUncheck.bind(this);    
      this.handleValidate = this.handleValidate.bind(this);   
    
      this.onAnswerCreated = this.onAnswerCreated.bind(this);   
      this.onErrorAnswerCreated = this.onErrorAnswerCreated.bind(this);         
    }

    componentDidMount() 
    {
      this.setState({ question :  this.props.question });
      this.loadQuestionData(this.props.question);
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
      let sequence1 = null;  
      let choices1 = [];      
      let msg = "";
      let mini = 1;
      let maxi = 1; 

      if (this.isOk(question))
      {
        sequence1 = this.world.getObjectById(question.sequence);
        choices1 = this.world.selectObjects("choice","question",question.id);

        if (question.multichoice === "yes")
        {
          if (this.isOk(choices1))
          {
            maxi = choices1.size;
          }

          if ( this.isOk(question.minchoices)  && this.isOk(question.maxchoices) )
          {          
            if (question.minchoices < question.maxchoices)
            {
              mini = question.minchoices;
              maxi = question.maxchoices;
              msg = this.getRscText("multichoicebetween1") + question.minchoices
                    + this.getRscText("multichoicebetween2") + question.maxchoices
                    + this.getRscText("multichoicebetween3") ;             
            }
            else if (question.minchoices > 0)
            {
              mini = question.minchoices;
              maxi = question.minchoices;
              msg = this.getRscText("multichoiceexactly1") + question.minchoices
                    + this.getRscText("multichoiceexactly2") ;         
            }
          }
          else if ( this.isNull(question.minchoices)  && this.isOk(question.maxchoices))
          {
            mini = 1;
            maxi = question.maxchoices;

            msg = this.getRscText("multichoicemaximum1") + question.maxchoices
                  + this.getRscText("multichoicemaximum2") ;             
          }          
          else if ( this.isOk(question.minchoices)  && this.isNull(question.maxchoices))
          {
            mini = question.minchoices;
            if (this.isOk(choices1))
            {
              maxi = choices1.size;
            }
            msg = this.getRscText("multichoiceminimum1") + question.minchoices
                  + this.getRscText("multichoiceminimum2") ;        
          }
          else if ( this.isNull(question.minchoices)  && this.isOk(question.maxchoices))
          {
            mini = 1;
            maxi = question.maxchoices;
            msg = this.getRscText("multichoicebetween1") + "1"  
                  + this.getRscText("multichoicebetween2") + question.maxchoices
                  + this.getRscText("multichoicebetween3") ;             
          }
        }
      } 
      
      this.setState( { sequence : sequence1 , choices : choices1, 
                       questionmessage : msg  , mini : mini , maxi : maxi }  );         
    }
 
    handleChoose(event) 
    {
      event.preventDefault();
      this.setState( { singlechoice : event.target.value });
    }

    handleMultiChoose(checkedValues) 
    {
      if (checkedValues.length > this.state.maxi)
      {        
        this.setState( { version : this.state.version + 1 });
        return;
      }

      let new_mchoice = new Map();
      checkedValues.forEach( cid => new_mchoice.set(cid,true));
      this.setState( { multichoice : new_mchoice });
    }

    onChangeBoxCheck(event) 
    {
      /*
      if (this.state.multichoice.size === this.state.maxi)
      {
        event.target.checked = false;
      } 
      else
      {
        this.state.multichoice.set(event.target.value, true);
        this.setState({ multichoice : this.state.multichoice });  
      }*/
    }
    
    onChangeBoxUncheck(event) 
    {   
      /*
      this.state.multichoice.delete(event.target.value);
      this.setState( { multichoice : this.state.multichoice });
      */
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
                                    {
                                       return true; 
                                    }
                                    else if ( othis.state.multichoice.size >= this.state.mini )
                                    { 
                                      return true; 
                                    }
                                    return false;
                                  };
      let isChosen = (othis, choiceId) =>  { return othis.state.multichoice.has(choiceId); };    

      let isFullyAnswered = (othis) => { return othis.state.multichoice.size === this.state.maxi ; }
      let getDisplay = (c) => { if (c.image !== null && c.image !== undefined) 
                                { return <div className="sfImage"><img src={c.image} alt="" /></div>;} 
                                return <></>; }

      if (this.isOk(this.state.question))
      {
        if (this.state.question.multichoice === "yes")
        {
          let othis = this;
          choicesBlock = <>            
             <Space direction="vertical">
              {this.state.questionmessage}         
              <Checkbox.Group    onChange={this.handleMultiChoose} className="sfMultiChoiceGroup" >
               {this.state.choices.map( function(c , i) { 
                            if (isChosen(othis , c.id) === true) 
                            {
                               return  <Row className="sfMultiChoiceGroupRow" ><Checkbox value={c.id} key={c.id} 
                                                 onChange={othis.onChangeBoxUncheck} checked >
                                                  <Space>{c.text}{getDisplay(c)}</Space>
                                                  </Checkbox></Row>;
                            }
                            else 
                            { 
                               return  <Row className="sfMultiChoiceGroupRow" ><Checkbox value={c.id} key={c.id}
                                                 onChange={othis.onChangeBoxCheck} disabled={isFullyAnswered(othis)} >
                                                 <Space>{c.text}{getDisplay(c)}</Space>
                                                 </Checkbox></Row>;
                            }
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
                  {this.state.choices.map( function(c , i) { return  <Radio value={c.id} key={c.id}>
                                                  <Space>{c.text}{getDisplay(c)}</Space>
                                                  </Radio> ;})}
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
               <Card title={this.isOk(this.state.sequence) ? this.state.sequence.name : ""} 
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