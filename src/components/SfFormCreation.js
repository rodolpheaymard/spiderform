import SfComponent from "./SfComponent";
import SfQuestion from "./SfQuestion";
//import SfForm from "./SfForm";

import { GlobalContext } from "./GlobalContext";



class SfFormCreation extends SfComponent {
  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;

      this.state = {  current_form : null,      
                      forms : [] };


      this.onDataLoaded= this.onDataLoaded.bind(this);
      this.onErrorDataLoaded= this.onErrorDataLoaded.bind(this);
    
      this.handleAddForm = this.handleAddForm.bind(this);
      this.onFormAdded = this.onFormAdded.bind(this);
      this.onErrorFormAdded = this.onErrorFormAdded.bind(this);
    
      this.handleSelectForm= this.handleSelectForm.bind(this);
      this.handleAddQuestion = this.handleAddQuestion.bind(this);
    }

    componentDidMount()
    {
        const context = this.context;
        this.setState({session : context.session});   

        this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded)
    }


    onErrorDataLoaded(response)
    {
      this.setState({  current_form : null , forms : null ,concepts : null});     
    }

    onDataLoaded(response)
    { 
      if (response !== null)
      {
        let currentform = null;
        if (response.forms !== null && response.forms.length > 0)
        {
          currentform = response.forms[0];
        }
        this.setState({  current_form : currentform , forms : response.forms ,concepts : response.concepts});
      }
    }

    handleAddForm(event) 
    {
      event.preventDefault();
  
      var { addnewform_name } = document.forms["addnewform"];
      let newformname = addnewform_name.value;

      this.world.addForm( { name : newformname , questions : [] } , this.onFormAdded, this.onErrorFormAdded);
    }

    onErrorFormAdded(response)
    {
    }

    onFormAdded(newform)
    { 
      this.setState({ forms: [...this.state.forms, newform] ,
                      current_form : newform}) ;
    }

    handleSelectForm(event) 
    {
      event.preventDefault();
  
      this.setState({ current_form : this.state.forms[event.target.selectedIndex] }) ;
    }

    handleAddQuestion(event) 
    {
      event.preventDefault();
  
      this.state.current_form.questions.push( {id: "X" , 
                                                text:" .... ?" ,
                                                choices: [{text:"... "}, 
                                                          {text:"... "}]} );

      this.setState( { current_form : this.state.currrent_form } );
    }


    render()
    {
      let formid = this.state.current_form !== null ? this.state.current_form.id : "";

      return ( <>
                <div className="sfFormCreation">
                  <p> FORM CREATION  </p>

                  <div className="SfFormList">                   
                     <div>
                      All Forms :
                      </div> 
                      <div>
                      <select value={formid} onChange={this.handleSelectForm}  >
                          {this.state.forms.map((f, i) => <option value={f.id} key={i} >{f.name}</option>)}
                      </select> 
                      </div>

                      <form className="SfAddNewForm" name="addnewform">
                         <input id="addnewform_name" name="addnewform_name"></input>
                         <input type="submit" value="Add new form" onClick={this.handleAddForm}/>         
                      </form>             
                  </div>


                  <p> questions list</p>
                  <div>
                  {this.state.current_form !== null && 
                   this.state.current_form.question !== null &&
                   this.state.current_form.question !== undefined ?
                        this.state.current_form.questions.map((q, i) => 
                        <div key={i}>
                          <SfQuestion question={q} key={q.id}/>
                        </div>
                       )
                       : "" }           
                  </div>
                  <div>                   
                    <button onClick={this.handleAddQuestion}>Add New Question</button>
                  </div>
                 
                </div>
                </>              
         );
    }
}

export default SfFormCreation;