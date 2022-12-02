import React from 'react';
import MdlSession from './MdlSession';
import SfComponent from './SfComponent';
import { GlobalContext } from "./GlobalContext";


class SfLogin extends SfComponent {
    static contextType = GlobalContext;
   
    constructor(props) {
      super(props);
      this.state = { errorMessage : null ,
                     session : null } ;

      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }


    handleLogout(event) 
    {
        event.preventDefault();
        this.setState({ errorMessage : null ,   session : null });
        const context = this.context;
        context.setSession(null);

        this.props.rerender();
      }

    handleLogin(event) 
    {
      event.preventDefault();

      var { uname, pass } = document.forms[0];
      var newSession = new MdlSession();
      var n = uname.value;
      var p = pass.value;
      var rc =  newSession.login(n, p);

      if (rc)  {
         this.setState({ session : newSession });
         const context = this.context;
         context.setSession(newSession);
         this.props.rerender();
        }
       else {
         this.setState({ errorMessage : newSession.errorMessage });
       }

    }

   
   
    renderErrorMessage() 
    {
      if (this.state.errorMessage !== null)
      {
        return <div className="error">{this.state.errorMessage}</div>
      }
      return <div></div>;
    }

    render()
    {
      const renderFormLogguedIn = (  <>
        <form className="SfLoginHeader">
            <div>
              Hello {this.state.session !== null 
                     && this.state.session.user.userName !== null ?
                            this.state.session.user.userName : "null"}, you are logged in
            </div>      
            <div className="SfButtonContainer">
              <input type="submit" value="logout" onClick={this.handleLogout}/>         
            </div>
         </form>             
        </>
      );

      const renderForm = ( <>
          <form className="SfLoginForm">
             <input type="text" name="uname" required placeholder='name...' />              
             <input type="password" name="pass" required placeholder='password...'/>   
              <div className="SfButtonContainer">
                <input type="submit" value="login" onClick={this.handleLogin}  />
                <div>{this.renderErrorMessage()}</div>
              </div>
          </form>
        </>
      );

      return ( <>
              <div className="SfLogin">
                {this.state.session != null ? renderFormLogguedIn :  renderForm}
              </div>
              </>  );
    }
}
 
export default SfLogin;