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
                    user_form_status : "" 
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
    if (this.context !== null && this.context !== undefined 
        && this.context.session !== null  && this.context.session !== undefined
        && this.context.session.user !== null  && this.context.session.user !== undefined)
    {
      let current_form = this.context.session.user_form;
      let current_form_status = "notstarted";
      if (current_form !== null && current_form !== undefined && current_form !== "")
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

  handleNext(event) 
  {
    event.preventDefault();
  }

  createUserForm(formId, userId)
  {
    let newform = { id : "", type : "user_form", form : formId, user : userId } ;
    this.world.addObject( newform , this.onObjectAdded, this.onErrorObjectAdded);
    return newform;
  }

  onErrorObjectAdded(response)
  {
  }

  onObjectAdded(newobj)
  { 
  }  

  getSessionUserForm()
  {
    if (this.context !== null  && this.context !== undefined 
      && this.context.session !== null && this.context.session !== undefined 
      && this.context.session.user_form !== undefined )
    {
      return this.context.session.user_form;
    }
    return null;
  }

  getNextQuestion()
  {
    let result = null;    
    if (this.state.user_data === null || this.state.user_data === undefined)
    {
      //this.loadUserData();
      return;
    }

    if (this.state.user_form !== null && this.state.user_form !== undefined )
    {        
      let allsequences = this.world.selectObjects("sequence", "form", this.state.user_form );
      let nbseq = allsequences.length;
      for(let ii=0; ii < nbseq && result===null; ii ++)
      {
        let allquestions = this.world.selectObjects("question", "sequence", allsequences[ii].id );
        let nbquest = allquestions.length;
        for(let jj=0; jj < nbquest && result===null ; jj ++)
        {
          let allchoices = this.world.selectObjects("choice", "question", allquestions[jj].id );
          let nbanswers = 0;
          this.state.user_data.forEach( (value, key, map) => { if (value.type === "user_choice" 
                                                                    && allchoices.includes(value["choice"])) 
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
    if (this.context.session !== null && this.context.session !== undefined)
    {
      let newsession = this.context.session;
      newsession.user_form = chosenForm.id;
      this.context.setSession(newsession);
    }

    if (this.state.user_data !== null)
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
              <SfWizardStep world={this.world} question={this.getNextQuestion()}/>
              
              <Button onClick={this.handleNext} type="primary" className="sfBtnWizardNext" > Next </Button>        
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
