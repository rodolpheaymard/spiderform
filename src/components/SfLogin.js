import React from 'react';
import MdlSession from './MdlSession';
import SfComponent from './SfComponent';
import SfLoginCreate from './SfLoginCreate';
import { GlobalContext } from "./GlobalContext";
import { Modal, Button , Space, Input, Row , Col}  from "antd";

class SfLogin extends SfComponent {
    static contextType = GlobalContext;
   
    constructor(props) {
      super(props);
      this.world = props.world;
      this.state = {errorMessage : null ,
                    session : null,
                    signingup : false,
                    username : null,
                    password : null};       

      this.handleChangeInput = this.handleChangeInput.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.finalizeLogin = this.finalizeLogin.bind(this);
      this.loginCallError = this.loginCallError.bind(this);

      this.handleSignUpStart = this.handleSignUpStart.bind(this);
      this.handleSignUpOk = this.handleSignUpOk.bind(this);
      this.handleSignUpCancel = this.handleSignUpCancel.bind(this);
      this.createLoginOK = this.createLoginOK.bind(this);
      this.createLoginError = this.createLoginError.bind(this);

      this.CreateLoginModal = React.createRef();
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

    handleChangeInput(key,e) 
    {
      if (key === "uname")
      {
        this.setState( { username : e.target.value} );       
      }
      else if (key === "pass")
      {
        this.setState( { password : e.target.value} );       

      }
    }

    handleLogin(event) 
    {
      event.preventDefault();
      this.world.login(this.state.username, this.state.password, this.finalizeLogin , this.loginCallError);
    }

    finalizeLogin(response)
    { 
      if (response !== null)
      {
        if (response.response === true)
        {
          var newSession = new MdlSession();
          newSession.user = response.user;

          this.context.setSession(newSession);
          this.setState({ session : newSession });
        }
        else
        {
          this.setState({ session : null , errorMessage : response.message });          
        }            
       }
    }

    loginCallError(error)
    {
      this.setState({ errorMessage : "unknown error while login" });          
    }
   
    handleSignUpStart(event) 
    {
        event.preventDefault();
        this.setState({ signingup : true });
    }

    handleSignUpOk(event) 
    {
        event.preventDefault();

        const createLoginModal = this.CreateLoginModal.current;
        if (this.world.isOk(createLoginModal))
        {
          this.world.newLogin(createLoginModal.state.username, createLoginModal.state.password, this.createLoginOK , this.createLoginError); 
        }
       
    }

    handleSignUpCancel(event) 
    {
        event.preventDefault();
        this.setState({ signingup : false });
    }

    createLoginOK(response)
    { 
      if (response !== null)
      {
        if (response.response === true)
        {
          var newSession = new MdlSession();
          newSession.user = response.user;
          this.setState({ session : newSession });
          this.context.setSession(newSession);    
          this.setState({ signingup : false });      
        }
        else
        {
          const createLoginModal = this.CreateLoginModal.current;
          if (this.world.isOk(createLoginModal))
          {
            createLoginModal.setState({errorMessage : response.message });  
          }
        }            
       }
    }

    createLoginError(error)
    {
      this.setState({ errorMessage : "unknown error while login" });          
    }

    renderErrorMessage() 
    {
      if (this.state.errorMessage !== null)
      {
        return <div className="sfErrorMessage">{this.state.errorMessage}</div>
      }
      return <div> </div>;
    }

    render()
    {
      const renderFormLogguedIn = (  <>
            <Col span={2}>           
            </Col>
            <Col span={12}>
              Hello {this.state.session !== null 
                      && this.state.session.user.username !== null ?
                      this.state.session.user.username : ""}, you are logged in
            </Col>
            <Col span={10}>
            <Button type="primary" onClick={this.handleLogout}>Logout</Button>
            </Col>
        </>
      );

      const renderForm = ( <>
            <Col span={14}>           
            </Col>
            <Col span={8}>
              <Space.Compact block align="center">
                <Input placeholder="name..."  value={this.state.username} 
                                              onChange={(e)=>{this.handleChangeInput("uname",e)}} />              
                <Input.Password placeholder="password..." value={this.state.password} 
                                                onChange={(e)=>{this.handleChangeInput("pass",e)}} />              
               
                <Button onClick={this.handleLogin}  type="primary" className="sfBtnEdit">Sign In</Button>
              </Space.Compact> 
              <div>{this.renderErrorMessage()}</div>
            </Col>
            <Col span={2}>
              <Space  size="small" align="center">
                 <Button onClick={this.handleSignUpStart} className="sfBtnEdit">Sign Up</Button>
              </Space>
            </Col>
       
          <Modal open={this.state.signingup} title="Sign Up" onOk={this.handleSignUpOk} onCancel={this.handleSignUpCancel}>              
                <SfLoginCreate world={this.world} ref={this.CreateLoginModal} />
          </Modal>         

        </>
      );

      return ( <>
              <Row className="sfLoginHeader" gutter={[10,5]}>
                {this.state.session != null ? renderFormLogguedIn :  renderForm}
              </Row>
              </>  );
    }
}
 
export default SfLogin;