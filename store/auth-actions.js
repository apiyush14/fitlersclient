import NetInfo from '@react-native-community/netinfo';
import { AsyncStorage } from 'react-native';

//TODO MSISDN should be encrypted
export const generateOTPForMSISDN=(msisdn)=>{
 return async dispatch=>{
 return new Promise((resolve,reject)=>{
    var URL="http://192.168.1.66:7001/auth/getOTP/"+msisdn;
    //console.log('Going to hit server');
    //console.log(URL);
    fetch(URL, { 
    method: 'GET',
    headers: { 
    'Content-Type':'application/json' 
    }
  }).then(response => response.json())
    .then((response)=> {
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};

export const validateOTPForMSISDN=(msisdn,otpCode)=>{
 return async dispatch=>{
 return new Promise((resolve,reject)=>{
    var URL="http://192.168.1.66:7001/auth/validateOTP/"+msisdn+"?otpCode="+otpCode;
    console.log('Going to hit server');
    console.log(URL);
    fetch(URL, { 
    method: 'GET',
    headers: { 
    'Content-Type':'application/json' 
    }
  }).then(response => response.json())
    .then((response)=> {
     console.log('===============Handshake Response');
     console.log(response);
     dispatch(tempMethodForTesting(response));
     dispatch(updateUserAuthenticationDetailsInDB(response));
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};

const updateUserAuthenticationDetailsInDB=(userAuthenticationDetails)=>{
 return async dispatch=>{
     try{
      await AsyncStorage.setItem('USER_ID',userAuthenticationDetails.userId);
      await AsyncStorage.setItem('USER_SECRET_KEY',userAuthenticationDetails.secret);
}
catch(err){
    console.log(err);
    throw err;
 };
 }
};