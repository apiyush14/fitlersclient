import React from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import RoundButton from '../components/RoundButton';

//Privacy
const Privacy = props => {
	return ( 
	 <View style={styles.privacyContainerStyle}>
	  <ScrollView style={styles.privacyScrollViewStyle}>
          <Text style={styles.smallTextStyle}>Last Updated on: April 29, 2021</Text>
        <Text style={styles.largeTextStyle}>PRIVACY POLICY</Text>
         <Text style={styles.smallTextStyle}>
This document is an electronic record in terms of Information Technology Act, 2000 and rules made thereunder and the same may be amended from time to time. Being a system generated electronic record, it does not require any physical or digital signature. Our Privacy Policy explains how we collect, use, disclose, and protect your information when you use our mobile application. Please read this Privacy Policy carefully. By accepting this Privacy Policy You are representing that You are eighteen (18) years of age or above. In case You are under the age of eighteen (18) years, then You are requested to not share any Sensitive Personal Information or Personal Information with us without having Your Parents to accept this Privacy Policy on Your behalf. IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS THE APPLICATION.
</Text>
        <Text style={styles.mediumTextStyle}>CHANGES TO THE PRIVACY POLICY</Text>
         <Text style={styles.smallTextStyle}>
We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Application after the date such revised Privacy Policy is posted.
         </Text>
        <Text style={styles.mediumTextStyle}>INFORMATION THAT WE COLLECT</Text>
         <Text style={styles.smallTextStyle}>
         We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content you use, and includes:
</Text>
<Text style={styles.smallTextStyle}>Personal Data</Text>
<Text style={styles.smallTextStyle}>
Registration information that you provide when you create an account, including your first name and lastname, weight, height, mobile number and otp.
</Text>
<Text style={styles.smallTextStyle}>
Location Information
</Text>
<Text style={styles.smallTextStyle}>
Location information when you use our platform to track the activity using multiple mobile sensors. Location information is based on the platform permissions and is optional, though if disabled, the user experience may get impacted
</Text>
<Text style={styles.smallTextStyle}>
Health Related Information
</Text>
<Text style={styles.smallTextStyle}>
We use Accelerometer and Pedometer sensors to track the activity and to calculate and provide different metrics to the user.
</Text>
<Text style={styles.smallTextStyle}>
We neither knowingly collect any information nor promote our Platform to any minor under the age of 18 (eighteen) years. If you are less than 18 (eighteen) years old or a minor in any other jurisdiction from where you access our Platform, we request that you do not submit information to us. If we become aware that a minor has registered with us and provided us with personal information, we may take steps to terminate such person’s registration and delete their account with us.
 </Text>
        <Text style={styles.mediumTextStyle}>USE OF YOUR INFORMATION</Text>
         <Text style={styles.smallTextStyle}>
         Having accurate information about you permit us to provide you with a smooth, efficient, and customized experience. We use the collected information for below purposes
</Text>
<Text style={styles.smallTextStyle}>
Create and manage your account.</Text>
<Text style={styles.smallTextStyle}>
Tracking of your physical activity, health and location for distance calculation</Text>
<Text style={styles.smallTextStyle}>
Create event leader board rankings</Text>
<Text style={styles.smallTextStyle}>
Deliver targeted advertising, other information regarding promotions and the application to you.</Text>
<Text style={styles.smallTextStyle}>
Generate a personal profile about you to make future visits to the Application more personalized.</Text>
<Text style={styles.smallTextStyle}>
Increase the efficiency and operation of the Application.</Text>
<Text style={styles.smallTextStyle}>
Offer new products, services, mobile applications, and/or recommendations to you.</Text>
<Text style={styles.smallTextStyle}>
Resolve disputes and troubleshoot problems.</Text>
<Text style={styles.smallTextStyle}>
Respond to product and customer service requests.</Text>
<Text style={styles.smallTextStyle}>
Enforce or exercise any rights in our Platform Terms and Conditions.
 </Text>
        <Text style={styles.mediumTextStyle}>DISCLOSURE OF YOUR INFORMATION</Text>
         <Text style={styles.smallTextStyle}>
         We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
</Text>
<Text style={styles.smallTextStyle}>
To Protect Rights
</Text>
<Text style={styles.smallTextStyle}>
If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection.
</Text>
<Text style={styles.smallTextStyle}>
Third-Party Service Providers
</Text>
<Text style={styles.smallTextStyle}>
We may share your information with third party parteners to develop and deliver targeted advertising on our Platform. We also may share aggregated, non-personal information, or personal information in hashed, non-human readable form, with third parties, including advisors, advertisers and investors, for the purpose of conducting general business analysis or other business purposes.
</Text>
<Text style={styles.smallTextStyle}>
Sale or Bankruptcy
</Text>
<Text style={styles.smallTextStyle}>
If we reorganize or sell all or a portion of our assets, undergo a merger, or are acquired by another entity, we may transfer your information to the successor entity. If we go out of business or enter bankruptcy, your information would be an asset transferred or acquired by a third party.
</Text>
        <Text style={styles.mediumTextStyle}>PROTECTION OF YOUR INFORMATION</Text>
         <Text style={styles.smallTextStyle}>
         We adopt reasonable security practices and procedures to help safeguard your personal information under our control from unauthorized access. From time to time, we review our security procedures to consider appropriate new technology and methods. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.Therefore, we cannot guarantee complete security if you provide personal information.You should always exercise caution while providing, sharing or disclosing your personal information using the Platform.
 </Text>
        <Text style={styles.mediumTextStyle}>OPTIONS TO CONTROL YOUR INFORMATION</Text>
         <Text style={styles.smallTextStyle}>
Account Information
</Text>
<Text style={styles.smallTextStyle}>
You may at any time review or change the information in your account or terminate your account by sending a mail to "fitlerscommunity@gmail.com". Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
</Text>
<Text style={styles.smallTextStyle}>
Location Information
</Text>
<Text style={styles.smallTextStyle}>
If you don't want to share location information, you can disable the location information from platform settings, however, the same may impact the overall user experience within the application.
         </Text>
        <Text style={styles.mediumTextStyle}>POLICY FOR CHILDREN</Text>
         <Text style={styles.smallTextStyle}>
We do not knowingly solicit information from or market to children under the age of 18. If we become aware that a minor has registered with us and provided us with personal information, we may take steps to terminate such person’s registration and delete their account with us.
</Text>
        <Text style={styles.mediumTextStyle}>CONTACT US</Text>
         <Text style={styles.smallTextStyleBottomPadding}>
         Please contact us by email on fitlerscommunity@gmail.com for any questions or comments regarding this Privacy Policy.
 </Text>
	  </ScrollView>
		<View style={styles.buttonContainerStyle}>
		 <RoundButton 
                 title="Close" 
                 style={styles.buttonStyle} 
                 onPress={()=>{
                  if(props.onClose){
                        props.onClose();
                  }
                  else{
                    props.navigation.navigate('HomeScreen');
                  }
                }}/>
        </View>
		</View>
	);
};

const styles = StyleSheet.create({
        privacyContainerStyle: {
                flex: 1,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center'
        },
        privacyScrollViewStyle: {
                flex: 1,
                paddingTop: '10%'
        },
        buttonContainerStyle: {
                padding: '4%',
                width: '100%',
                alignSelf: 'center',
                alignItems: 'center'
        },
        buttonStyle: {
                width: '100%',
                height: verticalScale(70),
                borderRadius: 25,
                bottom: '2%',
                backgroundColor: 'grey',
                opacity: 0.4
        },
        largeTextStyle: {
                padding: '3%',
                fontSize: moderateScale(40, 0.8),
                color: 'springgreen',
                fontFamily: 'open-sans'
        },
        mediumTextStyle: {
                padding: '3%',
                fontSize: moderateScale(17, 0.8),
                color: 'springgreen',
                fontFamily: 'open-sans'
        },
        smallTextStyle: {
                padding: '3%',
                fontSize: moderateScale(10, 0.8),
                color: 'springgreen',
                fontFamily: 'open-sans'
        },
        smallTextStyleBottomPadding: {
                padding: '3%',
                fontSize: moderateScale(10, 0.8),
                color: 'springgreen',
                fontFamily: 'open-sans',
                paddingBottom: '10%'
        }
});

export default Privacy;