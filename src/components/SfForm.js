import React from 'react';
import SfComponent from './SfComponent';

class SfForm extends SfComponent {
   
    constructor(props) {
      super(props);
      this.form = props.form;
      this.state = { } ;
    }

    render()
    {

      return ( <>
              <div className="sfForm">
                {this.form.name}
              </div>
              </>  );
    }
}
 
export default SfForm;