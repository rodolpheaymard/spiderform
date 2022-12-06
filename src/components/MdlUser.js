class MdlUser {
 
  constructor()
  {
      this.name = "";
      this.text = "";
      this.choices = [];
      this.errorMessage = "";
      this.loggued = false;
  }


  getAllUsers()
  {
    let result = [];

     // userName: "admin",
     // password: "admin",
     // isAdmin: true
    return result;
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

export default MdlUser;
     