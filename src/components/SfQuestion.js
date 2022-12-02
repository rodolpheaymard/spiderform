import React from 'react';
//import MdlSession from './MdlSession';
import SfComponent from './SfComponent';
//import { GlobalContext } from "./GlobalContext";


class SfQuestion extends SfComponent {
   // static contextType = GlobalContext;
   
    constructor(props) {
      super(props);
      this.state = { } ;
      this.question = this.props.question;
    }

    render()
    {

      return ( <>
              <div className="SfQuestion">
              <div className="SfQuestionInfo"> [{this.question.id}] {this.question.text}   </div> 
              <div className="SfQuestionChoices">{this.question.choices.map((c, i) => <div className="SfQuestionChoice" key={i}>{c.text}</div>)} </div>             
              </div>
              </>  );
    }
}
 
export default SfQuestion;