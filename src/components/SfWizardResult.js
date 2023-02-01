import React from 'react';
import SfComponent from './SfComponent';
import { Image , List } from "antd"; 


class SfWizardResult extends SfComponent {

    constructor(props) {
      super(props);
      this.world = props.world;  
      this.state = { data : props.data } ;
      }

    componentDidMount() 
    {
    }
  
    componentDidUpdate(prevProps) 
    {
      if (this.props.data !== prevProps.data) 
      {
        this.setState( {data : this.props.data } );
      }
    }
    


    render()
    {
      let selectImage = (score) => { if (score <0) return "/redarrow.png"; else  return "/greenarrow.png"; };

      let listExplanations =  [];
      this.state.data.scores.forEach(element => { listExplanations.push( <div> <Image src={selectImage(element.score)  } width="20px" heigth="18px"/>
                                                                           {element.explanation}   </div>); });
      return (<>      
                <div> {this.state.data.concept.explanation} </div> 
                <div> Your points come from thos reasons :</div>
                <div> <List dataSource={listExplanations} renderItem={(item) => (<List.Item>{item}</List.Item>)} />

                </div>
              </> );
    }
}
 
export default SfWizardResult;