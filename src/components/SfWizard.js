import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Button , Divider, Select } from "antd"; 


class SfWizard extends SfComponent {
  static contextType = GlobalContext;  // global context for session  
 
  constructor(props) {
    super(props);
    this.world = props.world;    
    
    this.state = {  user_id : null,
      user_data : null ,
      user_form : "",
      user_form_status : "" ,
      user_answer : null,
    }; 

    this.handleNext = this.handleNext.bind(this);
    this.handleChooseForm = this.handleChooseForm.bind(this);    
    this.onObjectAdded = this.onObjectAdded.bind(this);
    this.onErrorObjectAdded = this.onErrorObjectAdded.bind(this);     
    this.onDataLoaded = this.onDataLoaded.bind(this);
    this.onUserDataLoaded = this.onUserDataLoaded.bind(this);
    this.onErrorDataLoaded = this.onErrorDataLoaded.bind(this);     
  }

  componentDidMount() 
  {
    this.loadUserData();
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
    this.setState({ user_form_status : "started" });                      
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

  handleChooseForm(chosenForm) 
  {
    if (this.state.user_form !== chosenForm)
    {
      this.startForm(chosenForm);
    }
  }

  startForm(chosenForm)
  {
    if (this.context.session != null)
    {
      let newsession = this.context.session;
      newsession.user_form = chosenForm;
      this.context.setSession(newsession);
    }

    if (this.state.user_data !== null)
    {
      if (this.state.user_data.has(chosenForm) === false)
      {
        let newform =  this.createUserForm(chosenForm, this.state.user_id);
        let newuserdata = this.state.user_data;
        newuserdata.set(chosenForm,newform);
        this.setState({ user_data : newuserdata });
      }
    }
    this.setState({ user_form : chosenForm });  
  }
  
  render()
  { 
    let block = null
    switch (this.state.user_form_status) {
      case ("notstarted") :
        block = <>
                <div>Welcome to the Wonderful Form Filler</div> 
                <div>Please, select a form</div> 
                <Select style={{ width: 120 }}  onChange={this.handleChooseForm}
                              value={this.state.user_form}  
                              options={this.world.getOptionsList("form", "id", "name")} />
              </>;
      break;
      case ("started") :
        block = <>
              <div>Form : ...</div> 
              <div>Sequence : ...</div>               
              <div>Question : ...</div> 
              <div>Choose one or many answers   : ...</div> 
              </>;
      break;
      case ("finished") :
        block = <>
              <div>Thank you for havin filled this form.</div> 
              <div>Your results are the following :</div> 
              </>;
      break;
     default:
      break;
    } 


    return ( <>  
              {block}    
              <Divider/>
              <Button onClick={this.handleNext} type="primary" className="sfBtnWizardNext" > Next </Button>
              </>              
        );
  }
}

export default SfWizard;
