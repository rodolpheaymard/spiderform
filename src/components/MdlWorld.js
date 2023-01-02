import axios from 'axios';
const dotenv = require('dotenv');


class MdlWorld 
{
  constructor() 
  {
    this.datamap = new Map();
    this.server_url =  process.env.REACT_APP_API_URL;
  }

  init_dotenv()
  {
    dotenv.config();
    const result = dotenv.config()

    if (result.error) {
      console.log( "dotenv error" );
    }
    else
    {
      console.log(result.parsed);
    }
  }

  login(username,passwd, callback, errorcallback) {
    let cryptedpasswd = passwd;
    if (cryptedpasswd === "")
        cryptedpasswd = "none";
    let qryurl = this.server_url + "login/"+ username + "/" + cryptedpasswd  ;
    axios.get(qryurl)     
         .then( res =>  {             
                callback(res.data);  
            }, error => {
                console.log(error);
                errorcallback(error)
              });
  }

  loadData(callback, errorcallback) 
  {
    let qryurl = this.server_url + "all/concept/form/question/choice"  ;
    axios.get(qryurl)     
         .then( res =>  {
            this.datamap.set("concept",res.data.list1);
            this.datamap.set("form",res.data.list2);
            this.datamap.set("question",res.data.list3);
            this.datamap.set("choice",res.data.list4);
                
            let datamodel = { concepts : res.data.list1 ,
                              forms : res.data.list2,
                              questions : res.data.list3 ,
                              choices : res.data.list4  };
            callback(datamodel);  

            }, error => {
                console.log(error);
                errorcallback(error)
              });    
  }

  addObject( objStarter , callback, errorcallback)
  {
    let qryurl = this.server_url + "add/" + objStarter.type  ;
    let newobj = {id : objStarter.id , type : objStarter.type , deleted : false };
    axios.post(qryurl, newobj , null)
    .then ( res => {

      //this.datamap.get(res.data.type).push(res.data);
      callback(res.data);
    }, error => {
      errorcallback(error);
    });
  } 
  
  deleteObject( objToDelete , callback, errorcallback)
  {
    let qryurl = this.server_url + "remove/" + objToDelete.id ;
    axios.post(qryurl, {} , null)
    .then ( res => {
      callback(objToDelete);
    }, error => {
      errorcallback(error);
    });
  }

  columnsForType(objectType)
  {
    var result = [];

    switch(objectType)
    {
      case "user" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none"} );
        result.push( { key:"username" , title : "User Name", dataIndex: "username" , dataChooser: "text"} );
        break;
      case "concept" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none" } );
        result.push( { key:"name" , title : "Name", dataIndex: "name" , dataChooser: "text"} );
        result.push( { key:"explanation" , title : "Explanation", dataIndex: "explanation" , dataChooser: "text"} );
        result.push( { key:"jobs" , title : "Jobs", dataIndex: "jobs" , dataChooser: "text"} );
        break;
      case "form" :
        result.push( { key:"id" , title : "ID", dataIndex: "id"  , dataChooser: "none"} );
        result.push( { key:"name" , title : "Name", dataIndex: "name" , dataChooser: "text"} );
       break;
      case "question" :
        result.push( { key:"id" , title : "ID", dataIndex: "id"  , dataChooser: "none"} );
        result.push( { key:"form" , title : "In Form", dataIndex: "form", dataChooser: "select:form" } );
        result.push( { key:"sequence" , title : "Sequence", dataIndex: "sequence" , dataChooser: "text"} );
        result.push( { key:"text" , title : "Text", dataIndex: "text", dataChooser: "text" } );
         break;
      case "choice" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none" } );
        result.push( { key:"form" , title : "In Form", dataIndex: "form", dataChooser: "select:form" } );
        result.push( { key:"question" , title : "For Question", dataIndex: "question", dataChooser: "select:question" } );
        result.push( { key:"text" , title : "Text", dataIndex: "text" , dataChooser: "text"} );
        result.push( { key:"image" , title : "Image", dataIndex: "image" , dataChooser: "text"} );
        break;

      default:
        break;
    }
    return result;
  }

}

export default MdlWorld;





