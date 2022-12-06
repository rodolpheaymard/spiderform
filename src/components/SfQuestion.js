import React from 'react';
import SfComponent from './SfComponent';


class SfQuestion extends SfComponent {

    constructor(props) {
      super(props);
      this.state = { } ;
      this.question = this.props.question;
    }

    render()
    {
      const choices = this.question.choices !== null && this.question.choices !== undefined 
                      ? this.question.choices.map((c, i) => <div className="SfQuestionChoice" key={i}>{c.text}</div>)
                      : "";

      return ( <>
              <div className="SfQuestion">
              <div className="SfQuestionInfo"> [{this.question.id}] {this.question.text}   </div> 
              <div className="SfQuestionChoices">{choices} </div>             
              </div>
              </>  );
    }
}
 
export default SfQuestion;