import React from 'react';
import SfComponent from './SfComponent';
import { Card , Space, Collapse, Divider } from "antd"; 
import SfWizardResult from './SfWizardResult';
import { GlobalContext } from "./GlobalContext";

import DownloadLink from "react-download-link";

//import SfPdfResults from './SfPdfResults';
//import ReactPDF from '@react-18-pdf/renderer';


const { Panel } = Collapse;




class SfWizardEnd extends SfComponent {
  static contextType = GlobalContext;  // global context for session  
 
    constructor(props) {
      super(props);

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
        useranswer.choices.forEach( (userchoice) => {
          let scores = othis.world.getMatchingScores(userchoice);
          scores.forEach( (matchingscore , conceptid) => { 
              if (this.isOk(conceptid))
              {
                if (results.has(conceptid) === false)
                {
                  results.set(conceptid, {  total : 0, 
                                            scores : [], 
                                            concept : othis.world.getObjectById(conceptid),
                                            userchoices : [] });
                }
                let resultForConcept =  results.get(conceptid);
                resultForConcept.total += matchingscore.score;
                resultForConcept.scores.push(matchingscore);
  
                let userchoice = othis.world.getObjectById(matchingscore.choice);
                let userquestion = othis.world.getObjectById(userchoice.question);
                resultForConcept.userchoices.push( { score : matchingscore.score,  userchoice :  userchoice, userquestion : userquestion } );  
              }
            }) ;
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

    buildResultsFileName()
    {    
      let objUser = this.world.getObjectById(this.state.user);

      return "results_" + (objUser !== null ? objUser.username : "x") + ".txt";
    }
    
    buildResultsFile()
    {    
      let lines = [];
      let w = this.world;
      let objForm = w.getObjectById(this.state.form);

      lines.push("Form : "+ (objForm !== null ? objForm.name : "?") );      
      let today = new Date();
      lines.push("Generated " + today.getFullYear() + "/"+ (today.getMonth() + 1) + "/"+ today.getDate() + "." );

      lines.push("\n----------------------------------------");      
      lines.push("Results ");
      this.state.results.forEach((objData , conceptid) =>  { 
        lines.push( "  " + objData.concept.name + " : " + objData.total + " " + w.getRscText("pts") ); 
      });

      lines.push("\n----------------------------------------");
      lines.push("Details ");      
      if (this.isOk(this.state.userdata))
      {
        this.state.userdata.forEach( ( useranswer, questionid) => {
        let objQuestion = w.getObjectById(questionid);
        let written = false;
        useranswer.choices.forEach( (userchoice) => {            
          let scores = w.getMatchingScores(userchoice);
          scores.forEach( (matchingscore , conceptid) => { 
              let objChoice = w.getObjectById(matchingscore.choice);              
              if (this.isOk(conceptid))
              {              
                let objConcept = w.getObjectById(conceptid);

                if (written === false)
                {
                  lines.push( "\n [Q] " + objQuestion.text );
                  written = true;
                }                   
                lines.push ( "    [A] " + objChoice.text );
                lines.push ( "      => [" + objConcept.name + "] " + matchingscore.score + " "+ w.getRscText("pts"));       
              }
            }) ;
          });
        });
      }

      let result = lines.join("\n");
      return result;

      //ReactPDF.renderToStream(<SfPdfResults />);
    }


    render()
    {
      let w = this.world;

      let listResults =  [];
      this.state.results.forEach((objData , conceptid) =>{ listResults.push(<Panel header={objData.concept.name 
                                                                                            + ' : ' + objData.total 
                                                                                            + ' ' + w.getRscText("pts") } 
                                                                                   key={objData.concept.id}  >
                                                                              <SfWizardResult world={w} data={objData} form={this.state.form} />        
                                                                            </Panel>) });       
      
      return (<>      
               <Card title="The End" className="sfWizardEnd" >

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <p>{this.getRscText("thanks1")} </p>
                  <p>{this.getRscText("results1")} </p>
                </Space>

                <Collapse  accordion>        
                  { listResults }
                </Collapse>

                <Divider/>
                {this.getRscText("text_dl_results")}
                <br/>
                <DownloadLink    label= {this.getRscText("dl_results")}
                                     filename={this.buildResultsFileName()}
                                     exportFile={this.buildResultsFile.bind(this)}
                                    />
              </Card>
              </>  );
    }
}
 
export default SfWizardEnd;