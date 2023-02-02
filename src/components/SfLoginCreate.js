import React from "react";
import SfComponent from "./SfComponent";
import { GlobalContext } from "./GlobalContext";
import { Row, Col, Input } from "antd"; 
import MdlSession from "./MdlSession";


class SfLoginCreate extends SfComponent {

  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
      this.world = props.world;      
           
      this.state = { errorMessage : null , username : null , password : null }; 
    
      this.handleChangeInput = this.handleChangeInput.bind(this);
      this.handleCreateLogin = this.handleCreateLogin.bind(this);
      this.createLoginOK = this.createLoginOK.bind(this);
      this.createLoginError = this.createLoginError.bind(this);
    }

    componentDidUpdate(prevProps) 
    {
      if (this.props.editObject !== prevProps.editObject ) 
      {
      }
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

    handleCreateLogin(event)
    {
      event.preventDefault();
      this.world.newLogin(this.state.username, this.state.password, this.createLoginOK , this.createLoginError);
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
        }
        else
        {
          this.setState({ session : null , errorMessage : response.message });          
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
      return ( <>   
                  <Row >
                      <Col flex="100px">Choose your user name</Col> 
                      <Col flex="auto"> <Input placeholder="name..."  value={this.state.username} 
                                               onChange={(e)=>{this.handleChangeInput("uname",e)}} /> </Col>
                  </Row>
                  <Row >
                      <Col flex="100px">Choose your password</Col> 
                      <Col flex="auto"> <Input.Password placeholder="password..." value={this.state.password} 
                                               onChange={(e)=>{this.handleChangeInput("pass",e)}} />     </Col>
                  </Row>
                  <div>{this.renderErrorMessage()}</div>
                </>              
         );
    }

          



}

export default SfLoginCreate;
