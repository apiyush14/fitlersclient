/*
Model Class for User Details
*/

class UserAuthenticationDetails{
     constructor(userId,userSecretKey){
      this.userId=userId;
      this.userSecretKey=userSecretKey;
     }
}

export default UserAuthenticationDetails;