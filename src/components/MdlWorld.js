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

  cleanDataMap()
  {
    this.datamap.clear();
  }
  
  updateDataMap(obj)
  {
    if (this.datamap.has(obj.id))
    {
      this.datamap.delete(obj.id);
    }
    this.datamap.set(obj.id, obj);
  }

  updateDataMapList(list)
  {
    list.forEach( c => this.updateDataMap(c));
  }
  
  removeDataMap(obj)
  {
    if (this.datamap.has(obj.id))
    {
      this.datamap.delete(obj.id);
    }
  }

  getObjectsByType(objtype)
  {
    let result = [];
    this.datamap.forEach( (obj, id, map) => { if (obj.type === objtype) { result.push(obj);} } );
    return result;
  }

  loadData(callback, errorcallback) 
  {
    let qryurl = this.server_url + "all/"  ;
    let filter = {types : ["concept","form","question","sequence","choice","matchingscore"]};
    axios.post(qryurl, filter , null)    
         .then( res =>  {
            this.cleanDataMap();
            this.updateDataMapList(res.data.objects);                
            let datamodel = { objects : res.data.objects  };
            if (callback !== null)
            {
              callback(datamodel);  
            } 

            }, error => {
                console.log(error);
                if (errorcallback !== null)
                {
                  errorcallback(error); 
                }
            });    
  }

  addObject( objStarter , callback, errorcallback)
  {
    let qryurl = this.server_url + "add/" + objStarter.type  ;
    let newobj = {id : objStarter.id , type : objStarter.type , deleted : false };
    axios.post(qryurl, newobj , null)
    .then ( res => {
      this.updateDataMap(res.data);

      if (callback !== null)
      {
        callback(res.data);  
      } 
    }, error => {
      if (errorcallback !== null)
      {
        errorcallback(error);
      }
    });
  } 
  
  deleteObject( objToDelete , callback, errorcallback)
  {
    let qryurl = this.server_url + "remove/" + objToDelete.id ;
    axios.post(qryurl, {} , null)
    .then ( res => {
      this.removeDataMap(objToDelete);
      if (callback !== null)
      { 
        callback(objToDelete);
      }
    }, error => {
      if (errorcallback !== null)
      {
        errorcallback(error);
      }
    });
  }

  saveObject( objToSave , callback, errorcallback)
  {
    let qryurl = this.server_url + "save/" + objToSave.type;
    axios.post(qryurl, objToSave , null)
    .then ( res => {
      this.updateDataMap(objToSave);

      if (callback !== null)
      {
        callback(res.data);
      }
    }, error => {
      if (errorcallback !== null)
      {
        errorcallback(error);
      }
    });
  } 

  getTypesList() {
    return [{ value: "concept", label: "Concepts" },
            { value: "form", label: "Forms" },
            { value: "sequence", label: "Sequences" },
            { value: "question", label: "Questions" },
            { value: "choice", label: "Choices" },
            { value: "matchingscore", label: "Scores" }];
  }

  columnsForType(objectType)
  {
    var result = [];
    switch(objectType)
    {
      case "user" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none"} );
        result.push( { key:"username" , title : "Login", dataIndex: "username" , dataChooser: "text"} );
        result.push( { key:"password" , title : "Password", dataIndex: "password" , dataChooser: "password"} );
        break;
      case "concept" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none" } );
        result.push( { key:"name" , title : "Name", dataIndex: "name" , dataChooser: "text"} );
        result.push( { key:"explanation" , title : "Explanation", dataIndex: "explanation" , dataChooser: "textmultiline"} );
        result.push( { key:"jobs" , title : "Jobs", dataIndex: "jobs" , dataChooser: "text"} );
        break;
      case "form" :
        result.push( { key:"id" , title : "ID", dataIndex: "id"  , dataChooser: "none"} );
        result.push( { key:"name" , title : "Name", dataIndex: "name" , dataChooser: "text"} );
       break;
       case "sequence" :
        result.push( { key:"id" , title : "ID", dataIndex: "id"  , dataChooser: "none"} );
        result.push( { key:"name" , title : "Name", dataIndex: "name" , dataChooser: "text"} );
        result.push( { key:"form" , title : "Form", dataIndex: "form" , dataChooser: "select", dataChooserType: "form", dataChooserLabel: "name"} );
       break;
      case "question" :
        result.push( { key:"id" , title : "ID", dataIndex: "id"  , dataChooser: "none"} );
        result.push( { key:"form" , title : "Form", dataIndex: "form", dataChooser: "none", dataCalculated: "sequence.form" } );
        result.push( { key:"sequence" , title : "Sequence", dataIndex: "sequence", dataChooser: "select" , dataChooserType: "sequence" , dataChooserLabel: "name"} );
        result.push( { key:"text" , title : "Text", dataIndex: "text", dataChooser: "textmultiline" } );
        result.push( { key:"multichoice" , title : "Multi", dataIndex: "multichoice", dataChooser: "select", dataChooserType: "yes_or_no"  } );
      break;
        case "choice" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none" } );
        result.push( { key:"question" , title : "Question", dataIndex: "question", dataChooser: "select", dataChooserType: "question" , dataChooserLabel: "text"} );
        result.push( { key:"text" , title : "Text", dataIndex: "text" , dataChooser: "textmultiline"} );
        result.push( { key:"image" , title : "Image", dataIndex: "image" , dataChooser: "imageurl"} );
        break;
    case "matchingscore" :
        result.push( { key:"id" , title : "ID", dataIndex: "id" , dataChooser: "none" } );
        result.push( { key:"choice" , title : "Choice", dataIndex: "choice", dataChooser: "select", dataChooserType: "choice" , dataChooserLabel: "text" } );
        result.push( { key:"concept" , title : "Concept", dataIndex: "concept", dataChooser: "select", dataChooserType: "concept" , dataChooserLabel: "name" } );
        result.push( { key:"score" , title : "Score", dataIndex: "number" , dataChooser: "number"} );
        result.push( { key:"explanation" , title : "Explanation", dataIndex: "text" , dataChooser: "textmultiline"} );
        break;
    default:
        break;
    }

    
    return result;
  }

}

export default MdlWorld;



//const columns: ColumnsType<DataType> = [
//  {
//    title: 'Name',
//    dataIndex: 'name',
//    key: 'name',
//    filters: [
//      { text: 'Joe', value: 'Joe' },
//      { text: 'Jim', value: 'Jim' },
//    ],
//    filteredValue: filteredInfo.name || null,
//    onFilter: (value: string, record) => record.name.includes(value),
//    sorter: (a, b) => a.name.length - b.name.length,
//    sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
//    ellipsis: true,
//  },
  


