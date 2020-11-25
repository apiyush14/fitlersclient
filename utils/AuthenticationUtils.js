import { AsyncStorage } from 'react-native';
import * as Crypto from 'expo-crypto';

export const getUserAuthenticationToken=()=>{
	return async dispatch=>{
    var userId=await AsyncStorage.getItem('USER_ID');
    var userSecretKey=await AsyncStorage.getItem('USER_SECRET_KEY');

    var userIdHex=userId.replaceAll('-','');
    console.log("=======================HEADER TESTING=========================");
    var userIdUTF=decodeURI(hex_to_ascii(userIdHex));
    var secretUTF=decodeURI(hex_to_ascii(userSecretKey));
    var timeStamp=new Date().getTime();
    console.log(userIdUTF);
    console.log(timeStamp);
    console.log(secretUTF);
    var authenticationTokenDec=userIdHex+timeStamp+userSecretKey;
    console.log(authenticationTokenDec);
    const authenticationToken = await 
    Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,authenticationTokenDec);
    console.log('========================Authentication Token==================');
    console.log(authenticationToken);
    
    var requestHeaderForAuthentication={
     'X-AUTH': authenticationToken,
     'USER_ID': userId,
     'REQUEST_TIMESTAMP': timeStamp
    };

    console.log('==================Prepared Header=================');
    console.log(requestHeaderForAuthentication);

	return requestHeaderForAuthentication;
 };
};

const hex_to_ascii=(str1)=>
 {
  var hex  = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    //console.log(parseInt(hex.substr(n, 2), 16));
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
 };

 const ascii_to_hexa=(str)=>
  {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n ++) 
     {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
   }
  return arr1.join('');
   };

