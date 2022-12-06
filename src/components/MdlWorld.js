import axios from 'axios';


class MdlWorld 
{
  constructor() 
  {
    this.forms = [];
    this.concepts = [];
    this.server_url = process.env.REACT_APP_SERVER_URL + "/api/";

    this.localmode = true;

    try {
        this.load();                 
    } catch (error) {
      console.log('An error has occurred while loading ', error);
    }
  }

  load() {
    if (this.localmode === true)
    {
      this.concepts = [];
      this.forms = [];
      return;
    }

    axios.get(this.server_url + "all/concept" )
         .then(res => {   this.concepts = res.data;  });
    axios.get(this.server_url + "all/form" )
         .then(res => {   this.forms = res.data;  });
         
  }

  login(username,passwd, callback, errorcallback) {
    if (this.localmode === true)
    {
      let result = {};
      if (username === "admin")
      {
        if (passwd === "admin2")
        {
          result.response = true;
          result.message = "";
          result.user =  {username : "admin", isadmin : true } ;
        }
        else
        {
          result.response = false;
          result.message = "bad password";
          result.user =  null ;     
        }
      } else if (username === "camille")
      {
        if (passwd === "camille")
        {
          result.response = true;
          result.message = "";
          result.user =  {username : "camille", isadmin : false } ;
        }
        else
        {
          result.response = false;
          result.message = "bad password";
          result.user =  null ;     
   
        }
      } else if (username === "iris")
      {
        if (passwd === "iris")
        {
          result.response = true;
          result.message = "";
          result.user =  {username : "iris", isadmin : false } ;
        }
         else
        {
          result.response = false;
          result.message = "bad password";
          result.user =  null ;     
   
        }
      } else
      {
        result.response = false;
        result.message = "unknown user";
        result.user =  null ;     
      }
      callback(result);  
      return;
    }

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

  loadData(callback, errorcallback) {
    if (this.localmode === true)
    {
      return;
    }

    let qryurl = this.server_url + "all/concept/form"  ;
    axios.get(qryurl)     
         .then( res =>  {
              let datamodel = { concepts : res.data.list1 ,
                                forms : res.data.list2   };
              callback(datamodel);  
            }, error => {
                console.log(error);
                errorcallback(error)
              });
    
  }

  addForm( newform , callback, errorcallback)
  {
    if (this.localmode === true)
    {
      return;
    }
    

    let qryurl = this.server_url + "add/form"  ;
    axios.post(qryurl, newform , null)
    .then ( res => {
      callback(res.data);
    }, error => {
      errorcallback(error);
    })    
  }


}

export default MdlWorld;




