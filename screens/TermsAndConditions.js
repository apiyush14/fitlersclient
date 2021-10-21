import React from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import RoundButton from '../components/RoundButton';

//Terms&Conditions
const TermsAndConditions = props => {
	return ( 
	 <View style={styles.termsAndConditionsContainerStyle}>
	  <ScrollView style={styles.termsAndConditionsScrollViewStyle}>
          <Text style={styles.smallTextStyle}>Last Updated on: September 5, 2021</Text>
        <Text style={styles.largeTextStyle}>TERMS & CONDITIONS (T&C)</Text>
         <Text style={styles.smallTextStyle}>This document is an electronic record that constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Fitlers (“we,” “us” or “our”), concerning your access to and use of the application. You agree that by accessing our application, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of the Terms & Conditions, then you are expressly prohibited from using our application. By using the application, you have indicated to us that you have read, acknowledged and understood as well as fully agreed, to be bound by these App Terms and Conditions and Privacy Policy. By accepting this Privacy Policy you are representing that you are eighteen (18) years of age or above. In case you are under the age of eighteen (18) years, then you are requested to not share any Sensitive Personal Information or Personal Information with us by using the application.
         </Text>
        <Text style={styles.mediumTextStyle}>MODIFICATIONS TO THE TERMS & CONDITIONS</Text>
         <Text style={styles.smallTextStyle}>We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the “Last Updated” date of these Terms and Conditions and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms and Conditions. You will be subject to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the application after the Last Updated date.
         </Text>
        <Text style={styles.mediumTextStyle}>ABOUT THE APP</Text>
         <Text style={styles.smallTextStyle}>The App is proprietary to us and constitutes our intellectual property. Any intellectual property relating to any products and/or services offered on or through the App may be proprietary to us or our partners and shall constitute intellectual property. The App has an in-built tracking system whereby it keeps a track of users’ running distance, steps,acceleration and location and based on these data points, the user is able to get a complete view of the running/walking/jogging activities. The App is provided currently free of cost. The App also provides Live Events where user can participate in ongoing events and see the event results within the application.
         </Text>
        <Text style={styles.mediumTextStyle}>USER REGISTRATION</Text>
         <Text style={styles.smallTextStyle}>In order to use the App, you will have the option to sign in using your Mobile Number and your basic personal details (Name, Height and Weight). If You do so, you authorize us to access and use these details within the application. Your account details you provide to us must always be kept private and confidential and should not be disclosed to or permitted to be used by anyone else and you are solely responsible and liable for any and all usage and activity on the App that takes place under your account. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable. Each user is only permitted to have one account on this App platform. If the use of multiple accounts/registrations by a single user is found, we reserve the right to investigate, suspend and/or terminate, whether temporarily or permanently, your App account with us.
         </Text>
        <Text style={styles.mediumTextStyle}>PROHIBITED ACTIVITIES</Text>
         <Text style={styles.smallTextStyle}>The App is strictly available for your personal and non-commercial use only. You are hereby strictly prohibited from below activities :
         </Text>
         <Text style={styles.smallTextStyle}>1. Your Contributions do not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
</Text>
         <Text style={styles.smallTextStyle}>2. You will not Contribute any offensive, inaccurate, incomplete, inappropriate, abusive, obscene, threatening, intimidating, harassing, racially offensive, or illegal material or content that infringes or violates ours or any person’s rights.
</Text>
         <Text style={styles.smallTextStyle}>3. You represent and warrant that all information and content that you submit upon creation of your App account, is accurate, complete and truthful and that you will promptly update any information provided by you that subsequently becomes inaccurate, incomplete, misleading or false.
</Text>
         <Text style={styles.smallTextStyle}>4. You warrant that we may delete any Content, in whole or in part, that in our sole judgment violates these App Terms and Conditions or may harm the reputation of the App.
</Text>
         <Text style={styles.smallTextStyle}>5. Your Contributions do not include data that relates to or promotes or encourages money laundering, sex trafficking or gambling.
</Text>
         <Text style={styles.smallTextStyle}>6. Your Contributions do not contain or disseminate viruses, time bombs, trojan horses, worms or other harmful or disruptive codes.
</Text>
         <Text style={styles.smallTextStyle}>7. Your Contributions do not violate any applicable law, regulation, or rule.
</Text>
         <Text style={styles.smallTextStyle}>8. Your Contributions do not violate the privacy or publicity rights of any third party.
</Text>
         <Text style={styles.smallTextStyle}>9. Your Contributions do not contain any material that solicits personal information from anyone under the age of 18.
</Text>
         <Text style={styles.smallTextStyle}>10. Your Contributions towards submitting the data related to run/walk/jog is not generated by any emulation or any other sort of manual intervention with the App.
        </Text>
         <Text style={styles.smallTextStyle}>
          By agreeing to our Terms & Conditions, you agree that we may access, preserve and disclose your account information and content if required to do so by law such as to: (i) comply with applicable laws, requests or orders from law enforcement agencies (ii) protect or defend Ours, or any third party's rights or property (iii) enforce these App Terms and Conditions and Privacy Policy (iii) in support of any fraud/ legal investigation/ verification checks (iv) respond to your requests for customer service that needs this information. We assume no responsibility or liability for any deletion of or failure to store any of your content.
         </Text>
        <Text style={styles.mediumTextStyle}>THIRD PARTY CONTENT</Text>
         <Text style={styles.smallTextStyle}>The App may contain third party data such as photographs, text, graphics, pictures, designs, originating from third parties ("Third-Party Content"). This data may be Intellectual property of the third party partners and thus the use of this content for any kind of purpose is strictly prohibited.
         </Text>
        <Text style={styles.mediumTextStyle}>USER DATA</Text>
         <Text style={styles.smallTextStyle}>We will maintain certain data that you submit to the App for the purpose of managing the App, as well as data relating to your use of the App. Although we perform regular routine backups of data, you are solely responsible for all data that you submit or that relates to any activity you have undertaken using the App. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
</Text>
         <Text style={styles.smallTextStyle}>For information about the collection and possible use of information and content provided by you, please review our Privacy Policy. We reserve the right to disclose any information that you submit to us, if in our sole opinion, we reasonably believe that such disclosure is required to be disclosed (i) for complying with applicable laws, requests or orders from law enforcement agencies, appropriate competent authorities or for any legal process; (ii) for enforcing these App Terms & Conditions; (iii) for protecting or defending ours, any App user’s or any third party's rights or property; (iv) for supporting any fraud/ legal investigation/ verification checks; or (v) in connection with a corporate transaction, including but not limited to sale of Our business, merger, consolidation, or in the unlikely event of bankruptcy.
</Text>
         <Text style={styles.smallTextStyle}>By using the App, you hereby permit us to use the information you provide us, including your experiences to facilitate us to improve the App and its functionality as well as for promotional purposes, including the permission to share your non-personal information to use for research and analytical purposes.
         </Text>
        <Text style={styles.mediumTextStyle}>GOOGLE FIT DATA</Text>
      <Text style={styles.smallTextStyle}>Our application provides integration to the Google Fit. Once you provide in application access to integrate to your Google Fit account, the application can access data related to the distance and aggregate distance from Google Fit account. We do not access any other data except those mentioned here. We don't share the data related to Google Fit Integration with any third party.
      </Text>
        <Text style={styles.mediumTextStyle}>CHANGES TO THE APP</Text>
         <Text style={styles.smallTextStyle}>We reserve the right, in our sole discretion, at any time to modify or discontinue, temporarily or permanently, the App with or without notice. You agree that we shall not be liable to you or for any changes, suspension or termination of the App.It is your responsibility to periodically review these Terms and Conditions. You will be subject to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the application after the Last Updated date.
         </Text>
        <Text style={styles.mediumTextStyle}>DISCLAIMER OF WARRANTY</Text>
         <Text style={styles.smallTextStyle}>We have made our best efforts to make the App available to you but we cannot guarantee the App will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the App, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the App at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the App during any downtime or termination of the App.
         </Text>
        <Text style={styles.mediumTextStyle}>TERM AND TERMINATION</Text>
         <Text style={styles.smallTextStyle}>These Terms & Conditions shall remain in full force and effect while you use the App. We reserve the right, in our sole discretion, at any time to deny access to and use of the App to certain accounts, to any person for any or no reason. We may terminate your account or delete any content or information that you posted at any time without any warning or notice.
If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action as per the governing laws.
</Text>
        <Text style={styles.mediumTextStyle}>LIMITATIONS OF LIABILITY</Text>
         <Text style={styles.smallTextStyle}>To the extent permitted by applicable law, in no event will we be liable for any incidental, special, consequential or indirect damages arising out of or relating to the use or inability to use the App, result of using the App, including without limitation, damages for recommendation of the App, loss or corruption of data or programs, service interruptions and procurement of substitute services, even if we know or have been advised of the possibility of such damages. To the extent permitted by applicable law, in no event will We be liable for any damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, liquidated, punitive arising out of or relating to recommendation of the App, the conduct of any App user or anyone else in connection with the use of the App, including without limitation, bodily injury, emotional distress, financial loss and/or any other damages.
         </Text>
        <Text style={styles.mediumTextStyle}>INDEMNIFICATION</Text>
         <Text style={styles.smallTextStyle}>You agree to indemnify, defend and hold us harmless, as well as our partners, affiliates, subsidiaries, and each of their respective officers, directors, employees, agents, consultants and other related or affiliated third parties, from and against any and all losses, claims, costs, liabilities and expenses (including reasonable attorneys’ fees) relating to or arising out of your use of the App, including but not limited to :
</Text>
         <Text style={styles.smallTextStyle}>1. Use of the App
</Text>
         <Text style={styles.smallTextStyle}>2. Breach of these Terms of Use
</Text>
         <Text style={styles.smallTextStyle}>3. Any breach of your representations and warranties set forth in these Terms of Use
</Text>
         <Text style={styles.smallTextStyle}>4. Your violation of the rights of a third party, including but not limited to intellectual property rights
</Text>
         <Text style={styles.smallTextStyle}>5. Any harmful act toward any other user of the App
</Text>
         <Text style={styles.smallTextStyle}>
We reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it. 
         </Text>
        <Text style={styles.mediumTextStyle}>MISCELLANEOUS</Text>
         <Text style={styles.smallTextStyle}>These Terms of Use and any policies or operating rules posted by us on the App constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms of Use shall not operate as a waiver of such right or provision. These Terms of Use operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. You hereby waive any and all defenses you may have based on the electronic form of these Terms of Use and the lack of signing by the parties hereto to execute these Terms of Use.
         </Text>
        <Text style={styles.mediumTextStyle}>CONTACT US</Text>
         <Text style={styles.smallTextStyleBottomPadding}>
          Please contact us by email on fitlerscommunity@gmail.com for any questions or comments regarding the Terms & Conditions.
         </Text>
		</ScrollView>
		<View style={styles.buttonContainerStyle}>
		 <RoundButton 
                 title="Close" style={styles.buttonStyle} 
                 onPress={()=>{
                  if(props.onClose){
                        props.onClose();
                  }
                  else{
                    props.navigation.navigate('Home');
                  }
                }}/>
        </View>
		</View>
	);
};

const styles = StyleSheet.create({
        termsAndConditionsContainerStyle: {
                flex: 1,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center'
        },
        termsAndConditionsScrollViewStyle: {
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
                fontSize: moderateScale(20, 0.8),
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

export default TermsAndConditions;