import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import SfFormCreation from "./SfFormCreation";
import SfFormFiller from "./SfFormFiller";
import SfLogin from "./SfLogin";


class SfFormPage extends SfComponent {
    
    static contextType = GlobalContext;
 
    constructor(props)
    {
      super(props);      
      this.state = {session : null};   
    }

    componentDidMount()
    {
      const context = this.context;
      this.setState({session : context.session});   
    }

    rerender=()=>{
      this.forceUpdate();
    }
    
    isLoggued()
    { 
      const context = this.context;
      if( this.isOk(context.session) && this.isOk(context.session.user))
        return true;
      return false;  
    }
  
    isAdmin()
    {  
        const context = this.context;
        if( this.isLoggued() && context.session.user.isadmin === true) 
            return true;
        return false;  
    }
  
    render() {
        let forms;
        if (this.isAdmin()) {
            forms = <SfFormCreation world={this.world}/> ;
        } else if (this.isLoggued()) {
            forms = <SfFormFiller  world={this.world}/> ;      
        }

        return (
        <>
          <SfLogin rerender={this.rerender}  world={this.world}/>
          {forms}
        </> );
    }
  }
  export default SfFormPage;