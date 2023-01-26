import React from "react";
import { Divider, Space } from 'antd';
import SfComponent from "./SfComponent";
import SfWizard from "./SfWizard";
import { GlobalContext } from "./GlobalContext";


class SfFormFiller extends SfComponent {
  static contextType = GlobalContext;
 
  constructor(props) {
    super(props);
    this.world = props.world;

  }

  componentDidMount()
  { 
  
  }

  componentDidUpdate(prevProps) 
  {
  }

  render()
  {
    return ( <>                 
                <Space size="large" >
                  <div className="sfPageTitle"> Welcome to the Wonderful Form Filler </div>          
                </Space>
                <Divider/>
                <SfWizard world={this.world}  />
              </>              
       );     
  }
}

export default SfFormFiller;


    
    
    