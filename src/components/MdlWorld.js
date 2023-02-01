import axios from 'axios';
import CryptoJS from "crypto-js";

const dotenv = require('dotenv');
const secretPass = "XkhZG47zohfaf=+YETxfW2t2W";

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
  
  encrypt(passwd)
  {
    return CryptoJS.MD5(passwd + secretPass).toString().replace('/','U').replace('\\','V');
  }

  login(username,passwd, callback, errorcallback) {

    let cryptedpasswd = this.encrypt(passwd);

    let qryurl = this.server_url + "login/"+ username + "/" + cryptedpasswd  ;
    axios.get(qryurl)     
         .then( res =>  {             
                callback(res.data);  
            }, error => {
                console.log(error);
                errorcallback(error)
              });
  }

  isNull(obj)
  {
    return (obj === null || obj === undefined);
  }
  
  isOk(obj)
  {
    return !this.isNull(obj);
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

  backupObjects()
  {
    return "{ allobjects }";
  }

  getObjectsByType(objtype)
  {
    let result = [];
    this.datamap.forEach( (obj, id, map) => { if (obj.type === objtype) { result.push(obj);} } );
    return result;
  }

  selectObjects(objtype, filterprop, filterpropvalue)
  {
    let result = [];
    this.datamap.forEach( (obj, id, map) => 
                          { 
                            if (obj.type === objtype
                                && obj[filterprop] === filterpropvalue )
                            { 
                              result.push(obj);
                            } 
                          } 
                          );
    return result;
  }

  getObjectById(objid)
  {
    if (this.datamap.has(objid) === true)
    {
      return this.datamap.get(objid);
    }
    return null;
  }

  loadData(callback, errorcallback) 
  {
    let qryurl = this.server_url + "all/"  ;
    let filter = {types : this.getTypesList().map(c => c.value)};
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

  getDataSet()
  {
    let dataSet = new Map();
   
    this.getTypesList().forEach( typ => {
      let objs = this.getObjectsByType(typ);
      dataSet.set(typ.value, objs);          
    })
  
    return dataSet;
  }

  addObject( objStarter , callback, errorcallback)
  {
    let qryurl = this.server_url + "add/" + objStarter.type  ;
    objStarter.deleted = false;
    axios.post(qryurl, objStarter , null)
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

  loadUserData(user, callback, errorcallback) 
  {
    let qryurl = this.server_url + "filter/"  ;
    let filter = { filterprop : "user" , filterval : user.id, types : this.getUserDataList()};
    axios.post(qryurl, filter , null)    
         .then( res =>  {              
              let userdataobjects = this.buildFormsMap(res.data.objects) ;
              if (callback !== null)
              {
                callback(userdataobjects);  
              } 
            }, error => {
              console.log(error);
              if (errorcallback !== null)
              {
                errorcallback(error); 
              }
            });    
  }

  getOptionsList(objtype, propid, proplabel)
  {
    let lstobj = this.getObjectsByType(objtype);
    let result = [];
    lstobj.forEach( o => result.push({ value : o[propid], label : o[proplabel]}) );
    return result;
  }

  sortColumn( a, b , col) {
    let vala = a[col];
    let valb = b[col];
   if (vala === null || vala === undefined)
    {
      if ( valb === null || valb === undefined)
      {
        return 0;
      }
      return  -1;
    }
    if ( valb === null || valb === undefined)
    {
      return 1;
    }

    return (isNaN(vala) && isNaN(valb) ? (vala || '').localeCompare(valb || '') : vala - valb);
  }

  getFilters( objectType, colKey)
  {
    let mapResult = new Map();
    this.datamap.forEach( (obj, id, map) => { 
                                if (obj.type === objectType) 
                                { 
                                  if(mapResult.has(obj[colKey]) !== true)
                                  {
                                    mapResult.set(obj[colKey],obj[colKey]);
                                  }
                                } 
                              } );
    let keysArray = [];
    mapResult.forEach( (value,key) => keysArray.push(key) );
    keysArray = keysArray.sort();
    let result = [];
    keysArray.forEach( a => result.push({text : String(a), value : a}));    
    return result;  
  }

  applyFilter(value,record, colKey) 
  {    
    if (record[colKey] === null || record[colKey] === undefined)
    {
      return false;
    }

    if (isNaN(record[colKey]))
    {
      return record[colKey].indexOf(value.toString()) === 0 ;
    }
    else
    {
      return  record[colKey] === value;
    }
  }

  getColumn( objectType, colKey , colTitle, colDataChooser , colDataChooserType = null, colDataChooserLabel = null, colDataCalculated = null)
  {
    let result =  { key : colKey , 
                    render : (text) => (text !== undefined ? String(text) : ""),
                    title : colTitle,
                    dataIndex: colKey, 
                    dataChooser: colDataChooser,
                    filters: this.getFilters( objectType, colKey),
                    onFilter: (value, record) => this.applyFilter(value,record, colKey) ,
                    sorter: (a, b) => this.sortColumn(a,b,colKey)
                  };

    if (colDataChooserType !== null) {
      result.dataChooserType = colDataChooserType;
    }
    if (colDataChooserLabel !== null) {
      result.dataChooserLabel = colDataChooserLabel;
    }
    if (colDataCalculated !== null) {
      result.dataCalculated = colDataCalculated;
    }    
    return result;
  }

  getUserDataList() {
    return ["user_form", 
            "user_answer"];
  }

  buildFormsMap(objects)
  {
    let result = new Map();

    // scan user_form
    objects.forEach(obj => { 
      if(obj.type === "user_form" ) 
      { 
        obj.cache = {};
        obj.cache.answers = new Map();
        result.set(obj.form, obj); 
      }
    });

    // scan user_answer
    objects.forEach(obj => { 
      if(obj.type === "user_answer" ) 
      {
        let user_form = result.get(obj.form);
        user_form.cache.answers.set(obj.question , obj);
      } 
    });

    return result;
  }
  
  getUserAnswers(userForm)
  {
    if (this.isOk(userForm)&& this.isOk(userForm.cache) && this.isOk(userForm.cache.answers))
    {
      return userForm.cache.answers;
    }
    return new Map();  
  }

  getMatchingScores(userChoice)
  {
    let result = new Map();
    let scores = this.selectObjects("matchingscore", "choice", userChoice);

    scores.forEach( m => result.set(m.concept, m) );

    return result;
  }

  getTypesList() {
    return [{ value: "user",          label: "Users" },
            { value: "concept",       label: "Concepts" },
            { value: "form",          label: "Forms" },
            { value: "sequence",      label: "Sequences" },
            { value: "question",      label: "Questions" },
            { value: "choice",        label: "Choices" },
            { value: "matchingscore", label: "Scores" }];
  }

  columnsForType(objectType)
  {
    var result = [];
    switch(objectType)
    {
      case "user" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "username" , "Login", "none") );
        result.push( this.getColumn(objectType, "password" , "Password", "none") );
        result.push( this.getColumn(objectType, "isadmin" , "Admin ?", "none") );
        break;
      case "concept" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "name" , "Name", "text") );
        result.push( this.getColumn(objectType, "explanation" , "Explanation", "textmultiline") );
        result.push( this.getColumn(objectType, "jobs" , "Jobs", "text") );
        break;
      case "form" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "name" , "Name", "text") );
        result.push( this.getColumn(objectType, "with_explanations" , "Explanations", "select", "yes_or_no")  );
      break;
       case "sequence" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "name" , "Name", "text") );
        result.push( this.getColumn(objectType, "form" , "Form", "select" , "form", "name") );
       break;
      case "question" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "form" , "Form", "none" , null , null, "sequence.form.name") );
        result.push( this.getColumn(objectType, "sequence" , "Sequence", "select", "sequence", "name") );
        result.push( this.getColumn(objectType, "text" , "Text", "textmultiline") );
        result.push( this.getColumn(objectType, "multichoice" , "Multi", "select", "yes_or_no") );
      break;
      case "choice" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "question" , "Question", "select", "question", "text") );
        result.push( this.getColumn(objectType, "text" , "Text", "textmultiline") );
        result.push( this.getColumn(objectType, "image" , "Image", "imageurl") );   
        break;
      case "matchingscore" :
        result.push( this.getColumn(objectType, "id" , "ID", "none") );
        result.push( this.getColumn(objectType, "question" , "Question", "none" , null , null, "choice.question.text") );
        result.push( this.getColumn(objectType, "choice" , "Choice", "select", "choice", "text") );
        result.push( this.getColumn(objectType, "concept" , "Concept", "select", "concept", "name") );
        result.push( this.getColumn(objectType, "score" , "Score", "number") );
        result.push( this.getColumn(objectType, "explanation" , "Explanation", "textmultiline") );     
        break;
    default:
        break;
    }    
    return result;
  }
}

export default MdlWorld;

