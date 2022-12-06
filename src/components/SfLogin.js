import React from 'react';
import MdlSession from './MdlSession';
import SfComponent from './SfComponent';
import { GlobalContext } from "./GlobalContext";


class SfLogin extends SfComponent {
    static contextType = GlobalContext;
   
    constructor(props) {
      super(props);
      this.world = props.world;
      this.state = {errorMessage : null ,
                    session : null};       

      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.finalizeLogin = this.finalizeLogin.bind(this);
      this.loginCallError = this.loginCallError.bind(this);
      
    }

    componentDidMount()
    {
        const context = this.context;
        this.setState({session : context.session});   
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
      this.world.login(uname.value, pass.value, this.finalizeLogin , this.loginCallError);
    }

    finalizeLogin(response)
    { 
      if (response !== null)
      {
        if (response.response === true)
        {
          var newSession = new MdlSession();
          newSession.user = response.user;
          this.setState({ session : newSession });

          const context = this.context;
          context.setSession(newSession);
          
          this.props.rerender();
        }
        else
        {
          this.setState({ session : null });
           
          this.setState({ errorMessage : response.message });          
        }            
       }
    }

    loginCallError(error)
    {
      this.setState({ errorMessage : "unknown error while login" });          
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
                     && this.state.session.user.username !== null ?
                            this.state.session.user.username : "null"}, you are logged in
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