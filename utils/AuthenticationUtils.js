  import {
    AsyncStorage
  } from 'react-native';
  import * as Crypto from 'expo-crypto';

  export const getUserAuthenticationToken = () => {
    return async dispatch => {
      //await AsyncStorage.removeItem('USER_ID');
      var userId = await AsyncStorage.getItem('USER_ID');
      var userSecretKey = await AsyncStorage.getItem('USER_SECRET_KEY');
      if (!userId) {
        return null;
      }
      var userIdHex = userId.toString().replace(/-/g, '');
      var timeStamp = new Date().getTime();
      var authenticationTokenDec = userIdHex + timeStamp + userSecretKey;
      const authenticationToken = await
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, authenticationTokenDec);

      var requestHeaderForAuthentication = {
        'X-AUTH': authenticationToken,
        'USER_ID': userId,
        'REQUEST_TIMESTAMP': timeStamp,
        'Content-Type': 'application/json'
      };

      return requestHeaderForAuthentication;
    };
  };

  const hex_to_ascii = (str1) => {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  };

  const ascii_to_hexa = (str) => {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  };