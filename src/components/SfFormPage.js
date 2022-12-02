import React from "react";
import SfComponent from "./SfComponent";
import SfFormCreation from "./SfFormCreation";
import SfFormFiller from "./SfFormFiller";
import SfLogin from "./SfLogin";
import { GlobalContext } from "./GlobalContext";

class SfFormPage extends SfComponent {
    
    static contextType = GlobalContext;
 
    constructor(props)
    {
      super(props);
      this.state = {};
    }

    rerender=()=>{
        this.forceUpdate();
    }
    
    
    isLoggued()
    { 
        const context = this.context;
        if( context.session !== null
            && context.session.user !== null)
            return true;
        return false;  
    }
  
    isAdmin()
    {  
        const context = this.context;
        if( context.session !== null
            && context.session.user !== null
            && context.session.user.isAdmin === true) 
            return true;
        return false;  
    }
  
    render() {
        let forms;
        if (this.isAdmin()) {
            forms = <SfFormCreation/> ;
        } else if (this.isLoggued()) {
            forms = <SfFormFiller /> ;      
        }

        return (
        <>
          <SfLogin rerender={this.rerender}/>
          {forms}
        </> );
    }
  }
  export default SfFormPage;