import SfComponent from "./SfComponent";
import SfQuestion from "./SfQuestion";

class SfFormCreation extends SfComponent {
    
    constructor(props) {
      super(props);
      this.state = { questions : [ 
        { id: "1" , 
          text:"what is the answer to the fundatamental question of the Universe ?" ,
          choices: [{text:"yes"},{text:"maybe 33"},{text:"42"},{text:"you're too young to know"}]
        },
        { id: "2" , 
          text:"what is your favorite color ?" ,
          choices: [{text:"red"},{text:"blue"},{text:"red, hum ... no, blue !"},{text:"a rabbit ?"}]
        }
      ]
      }

      this.handleAddQuestion = this.handleAddQuestion.bind(this);
      console.log("constructor");
    }


    handleAddQuestion(event) 
    {
      event.preventDefault();
      console.log("new question");

      this.setState({ questions: [...this.state.questions, {id: "X" , 
                                                            text:" .... ?" ,
                                                            choices: [{text:"... "}, 
                                                                      {text:"... "}]}] }) ;
    }


    render()
    {

      return ( <>
                <div className="sfFormCreation">
                  <p> FORM CREATION  </p>

                  <div>
                  <button onClick={this.handleAddQuestion}>Add New Question</button>
                    
                  </div>
                  <div>
                  {this.state.questions.map((q, i) => <div key={i}><SfQuestion question={q} key={q.id}/></div>)}                    
                  </div>
                </div>
                </>              
         );
    }
}

export default SfFormCreation;