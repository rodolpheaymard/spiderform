
class SfResources {

  constructor() 
  {
    this.datamap = new Map();
    
    this.datamap.set( "default" , new Map() );
    let mapDef = this.datamap.get( "default" );
    mapDef.set("pts" , "points");  
    mapDef.set("welcome_filler" , "Welcome");
    mapDef.set("enter_val" , "enter value");
    mapDef.set("data_loading" , "loading data ...");
    mapDef.set("thanks1" , "Thank you for having filled this form.");
    mapDef.set("results1" , "Here are your results : ");

    mapDef.set("delconfirm0" , "Confirm");
    mapDef.set("delconfirm1" , "Do you really want to DELETE ?");
    mapDef.set("delconfirm2" , "Yes, sure");
    mapDef.set("delconfirm3" , "no, I don't mean it. oups");
    mapDef.set("dl_full" , "Download full export");

    mapDef.set("loggued" , "you are loggued in");
    mapDef.set("signin" , "Sign In");
    mapDef.set("signup" , "Sign Up");
    mapDef.set("signout" , "Sign Out");

    mapDef.set("create_login" , "create your login");
    mapDef.set("choose_pass" , "choose a password");

    mapDef.set("dataloaded1" , "world data loaded");
    mapDef.set("dataloaded2" , "user data loaded");

    mapDef.set("err_dataloading" , "error loading data");
    mapDef.set("err_login0" , "unknown error while login");
    mapDef.set("err_login1" , "you must enter a login");
    
    mapDef.set("select_form" , "Please, select a form to start or continue filling it");
    mapDef.set("start" , "Start");
    
    mapDef.set("validate" , "Validate");
    
    //mapDef.set("" , "");
    
  }

  getText(key) 
  { 
    return this.getLocalText(key, "default");
  }

  getLocalText(key, lang) 
  { 
    let pack = this.datamap.get("default");

    if (this.datamap.has(lang))
    {
      pack = this.datamap.get(lang);
    }
    if (pack.has(key))
    {
      return pack.get(key);
    }
    return "";
  } 
}

export default SfResources;