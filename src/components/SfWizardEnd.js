import React from 'react';
import SfComponent from './SfComponent';
import { Card , Space, Collapse } from "antd"; 
import SfWizardResult from './SfWizardResult';

const { Panel } = Collapse;

class SfWizardEnd extends SfComponent {

    constructor(props) {
      super(props);
      this.world = props.world;  
      this.state = { user : props.user,
                     form : props.form, 
                     userdata : props.userdata,
                     results : new Map() } ;

     
      this.onAnswerCreated = this.onAnswerCreated.bind(this);   
      this.onErrorAnswerCreated = this.onErrorAnswerCreated.bind(this);         
    }

    componentDidMount() 
    {
      this.calculateFormResults(null);
    }
  
    componentDidUpdate(prevProps) 
    {
      if (this.props.user !== prevProps.user  
          ||  this.props.form !== prevProps.form 
          ||  this.props.userdata !== prevProps.userdata  ) 
      {
        this.setState( {user : this.props.user,
                        form :  this.props.form, 
                        userdata : this.props.userdata ,
                        results : null } );
        this.calculateFormResults(this.props.userdata);
      }
    }
    
    calculateFormResults(userdata)
    {
       let useranswers = userdata !== null ? userdata : this.state.userdata;
       let results = new Map();
       let othis = this;
       useranswers.forEach( ( useranswer, questionid) => {
        useranswer.choices.forEach( (userchoice ) =>
          {
            let scores = othis.world.getMatchingScores(userchoice);
            scores.forEach( (matchingscore , conceptid) => { 
              if (results.has(conceptid) === false)
              {
                results.set(conceptid, { total:0, scores:[] });
              }
              results.get(conceptid).total += matchingscore.score;
              results.get(conceptid).scores.push(matchingscore);
              results.get(conceptid).concept = othis.world.getObjectById(conceptid);
            } );
          });
       });

       // sort by  highest to lowest total
       results = new Map([...results.entries()].sort((a, b) => a.total - b.total));

       
       this.setState({  results : results } );
    }

    onErrorAnswerCreated(response)
    {    
    }    

    onAnswerCreated(response)
    {      
    }


    render()
    {
      let w = this.world;

      let listResults =  [];
      this.state.results.forEach((objData , conceptid) =>{ listResults.push(<Panel header={objData.concept.name + ' : ' 
                                                                                           + objData.total + ' points' } 
                                                                                   key={objData.concept.id}  >
                                                                              <SfWizardResult world={w} data={objData} />        
                                                                            </Panel>) });       
      
      return (<>      
               <Card title="The End" className="sfWizardEnd" >

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <p>Thank you for having filled this form.</p>
                  <p>Here are your results : </p>
                </Space>

                <Collapse  accordion>        
                  { listResults }
                </Collapse>
              </Card>
              </>  );
    }
}
 
export default SfWizardEnd;