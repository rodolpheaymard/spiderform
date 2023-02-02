import React from "react";
import SfComponent from "./SfComponent";
import SfWizardStep from "./SfWizardStep";
import SfWizardEnd from "./SfWizardEnd";
import { GlobalContext } from "./GlobalContext";
import { Button , Avatar, List } from "antd"; 


class SfWizard extends SfComponent {
  static contextType = GlobalContext;  // global context for session  
 
  
  constructor(props) {
    super(props);
    this.world = props.world;    
    
    this.state = {  user_id : null,
                    user_data : null ,
                    user_form : "",
                    user_form_status : "",
                    user_answers : 0
    }; 

    this.handleNext = this.handleNext.bind(this);
    this.handleStartForm = this.handleStartForm.bind(this);    
    this.onObjectAdded = this.onObjectAdded.bind(this);
    this.onErrorObjectAdded = this.onErrorObjectAdded.bind(this);     
    this.onDataLoaded = this.onDataLoaded.bind(this);
    this.onUserDataLoaded = this.onUserDataLoaded.bind(this);
    this.onErrorDataLoaded = this.onErrorDataLoaded.bind(this);     
  }

  componentDidMount() 
  {
    this.loadUserData();
    this.setState({ user_form :  this.getSessionUserForm() });  
  }

  componentDidUpdate(prevProps) 
  {
  }  

  loadUserData()
  {
    if (this.world.isOk(this.context)
        && this.world.isOk(this.context.session)
        && this.world.isOk(this.context.session.user))
     {      
      this.setState( {user_id : this.context.session.user.id ,
                      user_data : null  } );
                      
      this.updateStatus(null);
 
      this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded);
    }
  }

  onErrorDataLoaded(response)
  {
    this.setState({ statusMessage : "error loading data"});
  }    

  onDataLoaded(response)
  {      
    if (this.context.session != null)
    {
      this.setState({ statusMessage : "world data loaded " });
      this.world.loadUserData( this.context.session.user , this.onUserDataLoaded, this.onErrorDataLoaded);
    }      
  }

  onUserDataLoaded(formsMap)
  {      
    if (this.context.session != null)
    {
      this.setState({ statusMessage : "user data loaded" ,
                      user_data : formsMap });
      this.updateStatus(formsMap);
    }      
  }

  createUserForm(formId, userId)
  {
    let newform = { id : "", type : "user_form", deleted : false,form : formId, user : userId , cache : { answers : new Map()} } ;
    this.world.addObject( newform , this.onObjectAdded, this.onErrorObjectAdded);
    return newform;
  }

  onErrorObjectAdded(response)
  {
  }

  onObjectAdded(newobj)
  { 
    if (newobj !== null && newobj !== undefined
        && newobj.type === "user_form")
    {
      if (this.world.isOk(this.state.user_data))
      {
        let newuserdata = this.state.user_data;
        newuserdata.get(newobj.form).id = newobj.id;
        this.setState({ user_data : newuserdata });
      }
    }
  }  

  getSessionUserForm()
  {
    if (this.world.isOk(this.context)
        && this.world.isOk(this.context.session)
        && this.world.isOk(this.context.session.user_form) )
    {
      return this.context.session.user_form;
    }
    return null;
  }
  
  updateStatus(formsMap)
  {
    let userDataFormsMap =  formsMap !== null ? formsMap : this.state.user_data;
  
    let newstatus = "notstarted";

    let current_form =  this.getSessionUserForm();
    if (this.world.isOk(current_form))
    {
      newstatus = "started";
      let nextquestion = this.getNextQuestion(userDataFormsMap);
      if (nextquestion === null)
      {
        newstatus = "finished";
      }
      this.setState( { user_form : current_form,
                       user_form_status : newstatus  } );
    }
    else
    {
      this.setState( {  user_form : null,
                        user_form_status : "notstarted"  } );
    }  
  }

  handleStartForm(chosenForm) 
  {
    if (this.state.user_form !== chosenForm.id)
    {
      this.startForm(chosenForm);
      this.setState({ user_form_status : "started" });          
    }
  }

  startForm(chosenForm)
  {
    if (this.world.isOk(this.context.session))
    {
      let newsession = this.context.session;
      newsession.user_form = chosenForm.id;
      this.context.setSession(newsession);
    }

    if (this.world.isOk(this.state.user_data))
    {
      if (this.state.user_data.has(chosenForm.id) === false)
      {
        let newform =  this.createUserForm(chosenForm.id, this.state.user_id);
        let newuserdata = this.state.user_data;
        newuserdata.set(newform.form,newform);
        this.setState({ user_data : newuserdata });
      }
    }
    this.setState({ user_form : chosenForm.id });  
  }
  

  handleNext(user_answer) 
  {

    if (this.world.isOk(this.state.user_data))
    {
      let userForm = this.state.user_data.get(this.state.user_form);
      userForm.cache.answers.set(user_answer.question, user_answer);   
    }
    
    this.updateStatus(null);
  }

  getNextQuestion(formsMap)
  {
    let userDataFormsMap =  formsMap !== null ? formsMap : this.state.user_data;
  
    let result = null;    
    if (this.world.isNull(userDataFormsMap))
    {
      return null;
    }

    if (this.world.isOk(this.state.user_form))
    {        
      let allsequences = this.world.selectObjects("sequence", "form", this.state.user_form );
      let nbseq = allsequences.length;
      for(let ii=0; ii < nbseq && result===null; ii ++)
      {
        let allquestions = this.world.selectObjects("question", "sequence", allsequences[ii].id );
        let nbquest = allquestions.length;
        for(let jj=0;jj < nbquest && result===null; jj++)
        { 
          let nbanswers = 0;
          let userForm = userDataFormsMap.get(this.state.user_form);
          let userAnswers = this.world.getUserAnswers(userForm);
          userAnswers.forEach( (value, key, map) => {
                                  if (value.question === allquestions[jj].id)
                                  {
                                    nbanswers ++;
                                  } 
                                } );
          if (nbanswers === 0)
          {
            result = allquestions[jj];
          }           
        
        }       
      }
    }     
    return result;
  }


  render()
  { 
    let block = null;
    let userAnswers= new Map();
    if (this.world.isOk(this.state.user_data)
        && this.world.isOk(this.state.user_form))
    {
      let userFormData = this.state.user_data.get(this.state.user_form);
      userAnswers = this.world.getUserAnswers(userFormData);
    }

    switch (this.state.user_form_status) {
      case ("notstarted") :
        block = <>
                <div className="sfWizardStart">                  
                  <div>Please, select a form to start or continue filling it</div> 
                    <List itemLayout="horizontal"
                          dataSource={this.world.getObjectsByType("form")}
                          renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta   avatar={<Avatar src="/formulaire-250x187.png" />}   title={item.name}  description=""/>
                            <Button onClick={()=> this.handleStartForm(item)}  type="primary" className="sfBtnEdit" key={item.id + "_start"}>Start</Button>
                          </List.Item>
                        )}
                      />
                  </div>

              </>;
      break;
      case ("started") :
        let curquestion = this.getNextQuestion(null);
        if (curquestion !== null)
        {
          block = <>
          <SfWizardStep world={this.world} user={this.state.user_id} form={this.state.user_form} 
                        question={curquestion} onValidated={this.handleNext}/>
          </>;
        }
      break;
      case ("finished") :
        block = <>
                  <SfWizardEnd world={this.world} user={this.state.user_id} form={this.state.user_form} userdata={userAnswers} />
                </>;
      break;
     default:
      break;
    } 

    return (<>{block}</>);
  }
}

export default SfWizard;
