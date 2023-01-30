import React from "react";
import SfComponent from "./SfComponent";
import SfWizardStep from "./SfWizardStep";
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
      let current_form_status = "notstarted";
    
      let current_form = this.context.session.user_form;
      if (this.world.isOk(current_form))
      {
        current_form_status = "started";
      }

      this.setState( {user_id : this.context.session.user.id ,
                      user_data : null ,
                      user_form : current_form,
                      user_form_status : current_form_status } );
      
      this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded);
      this.world.loadUserData( this.context.session.user , this.onUserDataLoaded, this.onErrorDataLoaded);
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
    }      
  }

  onUserDataLoaded(formsMap)
  {      
    if (this.context.session != null)
    {
      this.setState({ statusMessage : "user data loaded" ,
                      user_data : formsMap });
    }      
  }

  createUserForm(formId, userId)
  {
    let newform = { id : "", type : "user_form", form : formId, user : userId , cache : { answers : new Map()} } ;
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

    let newstatus = "started";

    let nextquestion = this.getNextQuestion();
    if (nextquestion === null)
    {
      newstatus = "finished";
    }

    this.setState( { user_form_status : newstatus , 
                     user_answers : this.state.user_answers + 1 } );

  }

  getNextQuestion()
  {
    let result = null;    
    if (this.world.isNull(this.state.user_data))
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
          let userForm = this.state.user_data.get(this.state.user_form);
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
    let block = null
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
        block = <>
              <SfWizardStep world={this.world} user={this.state.user_id} form={this.state.user_form} 
                            question={this.getNextQuestion()} onValidated={this.handleNext}/>
              </>;
      break;
      case ("finished") :
        block = <>
              <div>Thank you for having filled this form.</div> 
              <div>Your results are the following : </div> 
              </>;
      break;
     default:
      break;
    } 


    return ( <>  
              {block}    
              </>              
        );
  }
}

export default SfWizard;
