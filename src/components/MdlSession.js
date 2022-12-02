export default class MdlSession {
 
    constructor()
    {
      this.errorMessage = "";
      this.user = null;

        
      this.database = [{
        userName: "admin",
        password: "admin",
        isAdmin: true
      },
      {
        userName: "camille",
        password: "camille",
        isAdmin: false     
      },
      {
        userName: "iris",
        password: "iris",
        isAdmin: false     
      }
    ];

    this.login = this.login.bind(this);
    }

    login(uname, passwd) 
    {
      // Find user login info
      const userData = this.database.find((user) => user.userName === uname);
    
      // Compare user info
      if (userData) {
        if (userData.password !== passwd) {
          // Invalid password
          this.errorMessage = "invalid password for user, try again";
        } else {
          this.user = userData;       
          return true;   
        }
      } else {
        // Username not found
        this.errorMessage = "user not found";
      }
      return false;
    }
  
}
