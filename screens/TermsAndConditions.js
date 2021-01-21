import React from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import RoundButton from '../components/RoundButton';

//Terms&Conditions
const TermsAndConditions = props => {
	return ( 
	 <View style={styles.termsAndConditionsContainerStyle}>
	  <ScrollView style={styles.termsAndConditionsScrollViewStyle}>
        <Text style={styles.largeTextStyle}>Terms & Conditions (T&C)</Text>
         <Text style={styles.smallTextStyle}>This document is an electronic record in terms of Information Technology Act, 2000 and rules made thereunder and as the same may be amended from time to time. Being a system generated electronic record, it does not require any physical or digital signature. Greetings from StepSetGo (hereinafter referred to as the “App”). The App is owned by PepKit Media Pvt. Ltd., a company incorporated in India (hereinafter referred to as “We” or “Our” or “Us” or “Company”).
By accessing Our App from any computer, computer device, mobile, smartphone or any electronic device, You (hereinafter referred to as “You” or “Your”) expressly agree to be bound by these App related Terms and Conditions (hereinafter referred to as the “App Terms and Conditions”).
If You use the App, You are required to first carefully read as well as fully understand these App Terms and Conditions which are applicable when You view/access/use (hereinafter collectively, referred to as “use” or “using”) the App. Please also carefully read and fully understand Our Privacy Policy available at [●] (hereinafter referred to as the “Privacy Policy”), which is incorporated in these App Terms and Conditions by reference.
If, for any reason, You do not agree to these App Terms and Conditions, Privacy Policy and/or other App guidelines and policies (guidelines and policies hereinafter collectively referred to as “Other Policies”) as communicated to You when You use the App or do not wish to be bound by them, please do not use the App in any way whatsoever. By using the App, You have indicated to Us that You have read, acknowledged and understood as well as fully agreed, to be bound by these App Terms and Conditions, Privacy Policy and all Other Policies, irrespective whether You register with or use the App or create an account with Us or not.
         </Text>
        <Text style={styles.mediumTextStyle}>ABOUT THE APP</Text>
         <Text style={styles.smallTextStyle}>The App is proprietary to Us and constitutes Our intellectual property. Any intellectual property relating to any products and/or services offered on or through the App may be proprietary to Us or Our partners and shall constitute Ours or Our partners’ intellectual property as the case may be.
The App has an in-built tracking system whereby it keeps a track of users’ steps and based on such tracked steps, coins or points get added to such user’s App account every time such user walks or runs/jogs or takes any step.
Based on the minimum number of coins/points (as mentioned in the App) collected in the user’s account, the user can redeem the same either against products and/or services offered on or through the App, whether they are offered by Us or by our partners. Further, the said coins/points can also be used to avail various discount offers that may be made available on or through the App, whether by Us or by our partners. If there are any specific or additional terms and conditions attached to any such offered products and/or services, then the same will also be applicable and shall form an integral part of these App Terms and Conditions.
The App is provided currently free of cost. We may convert the App to a subscription based model at a future date. However, We shall communicate the same to You as and when We decide to do so.
Currently, this App is not applicable for any cycling or any other activity except for walking and running/jogging. If any such activity is permitted at any later date, then these App Terms and Conditions will be applicable to the same as well.
         </Text>
        <Text style={styles.mediumTextStyle}>ACCEPTANCE OF TERMS, ETC.</Text>
         <Text style={styles.smallTextStyle}>These App Terms and Conditions is in the form of an electronic and legally binding contract that establishes the terms and conditions You have accepted before using the App or any part thereof. These include Our Privacy Policy and Other Policies as mentioned in these App Terms and Conditions as well as other specific policies and terms and conditions disclosed to You, in case You avail any subscription or any additional features, products or services We offer on or through the App, whether free or otherwise, including but not limited to terms governing features, billing, free trials, promotions and discounts. By using the App, You hereby unconditionally consent and accept to these App Terms and Conditions, Privacy Policy and Other Policies. To withdraw such consent, You must immediately cease using the App and terminate Your account with Us. You are requested to keep a physical copy of these App Terms and Conditions and all other referred policies herein for Your records.
You consent to have these App Terms and Conditions and all notices provided to You in electronic form.
Every time You use the App, You confirm Your agreement with these App Terms and Conditions, Privacy Policy and Other Policies.
         </Text>
        <Text style={styles.mediumTextStyle}>ELIGIBILITY</Text>
         <Text style={styles.smallTextStyle}>The minimum age to use the App is 18 (eighteen) years. By using the App and in order to be competent to contract under applicable law, You represent and warrant that You are at least 18 (eighteen) years of age or not a minor in any other jurisdiction from where You access Our App.
By using the App, You hereby represent and warrant to Us that You have all right, authority and capacity to enter into these App Terms and Conditions and to abide by all of the terms and conditions thereof.
         </Text>
        <Text style={styles.mediumTextStyle}>APP ACCOUNT</Text>
         <Text style={styles.smallTextStyle}>
In order to use the App, You have the option of signing in using Your Facebook/Google login. If You do so, You authorize Us to access and use certain Facebook/Google account information of Yours, including but not limited to Your public Facebook/Google profile and information about Your Facebook/Google friends, Your interests and dislikes. For more information regarding the type/nature of information We collect from You and how We use it, please refer Our Privacy Policy at [●].
Your account details You provide to Us must always be kept private and confidential and should not be disclosed to or permitted to be used by anyone else and You are solely responsible and liable for any and all usage and activity on the App that takes place under Your account.
By agreeing to these App Terms and Conditions, You grant Us the permission to send electronic communications to You as part of Our offering. This includes but is not limited to sending emails, newsletters, notifications and promotional offers from Us and Our partners. Should You no longer wish to receive such electronic communications, You may write to Us at support@stepsetgo.com
Any account You open with Us is personal to You and You are prohibited from gifting, lending, transferring or otherwise permitting any other person or entity to access or use Your account in any way whatsoever.
Each User is only permitted to have one account on this App platform. If the use of multiple accounts/registrations by a single user is found, We reserve the right to investigate, suspend and/or terminate, whether temporarily or permanently, Your App account with Us.
         </Text>
        <Text style={styles.mediumTextStyle}>TERM AND TERMINATION</Text>
         <Text style={styles.smallTextStyle}>
These Terms will remain in full force and effect while You use the App or any part thereof.
You may terminate or disable Your App account at any time and for any reason by deleting the App from Your device.
We may, at Our sole discretion, terminate or suspend, whether temporarily or permanently, Your App account at any time with or without notice and for any reason, including for Your breach of these App Terms and Conditions. After Your App account is terminated or suspended, all the terms hereof shall survive such termination or suspension, and continue in full force and effect, except for any terms that by their nature expire or are fully satisfied.
You acknowledge that We reserve the right to terminate or delete Your account in case it remains 'inactive' for a duration as determined by Us in Our sole discretion. If We terminate or suspend Your account because You have breached this Agreement, You will not be entitled to any refund of unused subscription fees and for any fees towards any in-App purchases.
Following termination of these App Terms and Terms, We will only retain and use Your content in accordance with these App Terms and Conditions.
         </Text>
        <Text style={styles.mediumTextStyle}>APP USAGE</Text>
         <Text style={styles.smallTextStyle}>
The App is strictly available for Your personal and non-commercial use only.
You are hereby strictly prohibited from and against:
undertaking any marketing, promotion, advertising or soliciting any other App user to buy or sell any products or services whether through the App or not;
transmitting any chain letters, junk, bulk or spam e-mail or other unsolicited communications of any kind whatsoever to other App users or publishing the same on the App or anywhere else; and
contacting any App user or using the details of any App user for any purpose not expressly permitted under these App Terms and Conditions.
It is hereby expressly clarified that any of the aforesaid acts undertaken by You shall be to Your sole liability, responsibility, risk and consequences and You hereby agree to indemnify Us for the same.
You agree to take all necessary precautions in all interactions with other App users when You communicate with them through the App, if permitted.
         </Text>
        <Text style={styles.mediumTextStyle}>ACCOUNT SECURITY</Text>
         <Text style={styles.smallTextStyle}>
You shall be solely responsible and liable for maintaining the utmost privacy and confidentiality of Your App log-in (username and password) details as well as for any and all activities that occur under Your log-in. You agree to immediately notify Us of any disclosure or unauthorized use of Your log-in or any other breach of security by emailing us on support@stepsetgo.com

         </Text>
        <Text style={styles.mediumTextStyle}>PROPRIETARY RIGHTS</Text>
         <Text style={styles.smallTextStyle}>
You confirm and agree that We or Our partners are the owner of the proprietary information made available to You through the App and hereby retain all proprietary and intellectual property rights in the same, including but not limited to all confidential information.
You undertake not to post, copy, modify, transmit, disclose, show in public, create any derivative works from, distribute, make commercial use of, or reproduce in any way, and whether partly or fully, any (i) confidential or proprietary information, or (ii) copyrighted or copyrightable material, trademarks, service marks or other proprietary information accessible via the App; whether belonging to Us or not without first obtaining Our prior written consent.
Other App users may upload/publish/post any copyrighted information, which may have copyright protection or not or which may be identified as copyright. You undertake not to copy, modify, publish, transmit, distribute, perform, display, commercially use/exploit, sell or use such information in any way and for any purpose whatsoever.
By posting information or content to any profile pages or public area of the App, or making it accessible to Us by linking Your account to any social network accounts (e.g. via Facebook, Twitter, Instagram etc.), You grant Us unconditionally and in perpetuity, and represent and warrant that You have the right to grant to Us, an irrevocable, perpetual, non-exclusive, fully-paid/royalty-free, worldwide license to use, reproduce, publicly perform, publicly display and distribute such information and content, and to prepare derivative works of, or incorporate into other works, such information and content, and to grant and authorize sub-licenses of the foregoing anywhere in the world. From time to time, We may modify, add or vary existing features or programs of the App or create, add, test or implement new features or programs on the App in which You may voluntarily choose to participate or may be a part of a test group with special access, in accordance with the additional terms and conditions of such features or programs. By participating in such features or programs, You grant Us an unconditional and perpetual right and consent to the terms and conditions (if any) of such features or programs which will be in addition to these App Terms and Conditions.
         </Text>
        <Text style={styles.mediumTextStyle}>USER INFORMATION</Text>
         <Text style={styles.smallTextStyle}>
For information about the collection and possible use of information and content provided by You, please review Our Privacy Policy at the link [●].
It is hereby expressly agreed and understood by You that for exchanging personal contact information of Yours with any other App user, You shall have the choice to opt into the exchange. Upon choosing to opt in, You shall be solely responsible and liable for any and all risks and consequences thereof and You hereby agree to indemnify Us for the same.
Notwithstanding any other provisions of these App Terms and Conditions, We reserve the right to disclose any information that You submit to Us, if in Our sole opinion, We reasonably believe that such disclosure is required to be disclosed (i) for complying with applicable laws, requests or orders from law enforcement agencies, appropriate competent authorities or for any legal process; (ii) for enforcing these App Terms and Conditions; (iii) for protecting or defending Ours, any App user’s or any third party's rights or property; (iv) for supporting any fraud/ legal investigation/ verification checks; or (v) in connection with a corporate transaction, including but not limited to sale of Our business, merger, consolidation, or in the unlikely event of bankruptcy. You acknowledge and understand the provisions of this Clause 9.3 and grant Us an unconditional, perpetual right and permission to make such disclosure.
By using the App, You hereby permit Us to use the information You provide Us, including Your experiences to facilitate Us to improve the App and its functionality as well as for promotional purposes, including the permission to publish Your non-personal information in any of Our partner websites and/or to use for research and analytical purposes.
         </Text>
        <Text style={styles.mediumTextStyle}>PROHIBITED ACTIVITIES</Text>
         <Text style={styles.smallTextStyle}>
We reserve the right to investigate, suspend and/or terminate, whether temporarily or permanently, Your App account with Us if You undertake any of the following acts:
breach these App Terms and Conditions, Privacy Policy or Other Policies;
abuse, impersonate or defame Us or any App user or any other person, entity or any religious community;
use the App for any commercial use or activity not expressly permitted as per Clause 6 of these Terms;
“stalk” or otherwise harass any App user or any other person;
make any statements, whether expressed or implied, and whether privately or publicly, as those endorsed by Us without Our specific prior written consent;
use the App in an illegal manner or commit an illegal act or use the App not expressly authorized by Us;
use any robot, spider, tool, site search/retrieval application, or other manual or automatic device or process to retrieve, index, ‘data mine’, or in any way reproduce or circumvent the navigational structure or presentation of the App;
collect any personal information, including contact details, of any App users by electronic or any other means and for any purpose, not expressly permitted under these App Terms and Conditions;
send any unsolicited email or any other communication in any way whatsoever not expressly permitted under these App Terms and Conditions;
undertake any unauthorized framing of or linking to the App or “frame” or “mirror” any part of the App, without Our prior written authorization;
interfere with, obstruct, destroy or disrupt the App or the servers or networks connected to the App, whether partly or fully and whether permanently or temporarily;
email or otherwise transmit any content or material that contains software viruses, malware, spyware or any other computer code, files or programs designed to interrupt, destroy, disrupt or limit the functionality of the App or of any computer software or hardware or telecommunications equipment connected with the App;
m. forge headers or otherwise manipulate identifiers in order to disguise the origin of any information transmitted to or through the App (either directly or indirectly through use of any third party software);
use meta tags, code, programs or other devices, tools or technology containing any reference to Us or the App (or any trademark, trade name, service mark, logo or slogan of Ours or Our partners) to direct any person to any other website or link or application for any purpose;
directly or indirectly modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the App; or
post, use, transmit or distribute, directly or indirectly, in any manner or media any content (whether textual, graphical, images, audio, video, audio-video or any combination thereof) or information obtained from the App other than solely in connection with Your use of the App in accordance with these App Terms and Conditions.
registration of multiple accounts for a single user or registration of multiple accounts by assuming fake identities;
undertaking and participating in any fraudulent activities with a purpose to collect invite rewards;
hit Our servers/use a code/ undertake in any fraudulent activities to emulate steps, or adopt any means whatsoever to show and claim a number of steps, that is over and above the steps counted by Our App i.e. steps actually walked/run by the User of the account.
         </Text>
        <Text style={styles.mediumTextStyle}>CONTENT POSTED BY YOU</Text>
         <Text style={styles.smallTextStyle}>
You are solely responsible for any and all content or information that You post, upload, share, publish, link to, transmit, record, display or otherwise make available (hereinafter collectively referred to as “publish”) on or through the App or transmit to other App users, including text messages, chat, audio, video, photographs, images, graphics or any combination thereof, whether publicly published or privately transmitted (hereinafter collectively referred to as “Content”).
We do not verify or validate the completeness, accuracy or truth of any Content You publish on or through the App. We are not the publisher of the Content and only provide You with a technology platform to facilitate You to publish such Content. We assume no responsibility or liability of any sort whatsoever for providing a technology platform to Our App users to facilitate to publish their Content. To protect the integrity of the App, We reserve the right to exercise editorial control over Your Content, including the right to block any user from accessing the App, whether temporarily or permanently.
You shall not publish to Us or to any other App user (either on or off the App), any offensive, inaccurate, incomplete, inappropriate, abusive, obscene, profane, threatening, intimidating, harassing, racially offensive, or illegal material or content that infringes or violates Ours or our partners or any person’s rights (including intellectual property rights, and rights of privacy and publicity).
You represent and warrant that (i) all information and Content that You submit upon creation of Your App account, including information submitted from any permissible linked third party account, is accurate, complete and truthful and that You will promptly update any information provided by You that subsequently becomes inaccurate, incomplete, misleading or false and (ii) You have the right to publish the Content on the App and grant the licenses as agreed in these App Terms and Conditions.
You understand and agree that We may monitor or review any Content You publish on the App. We may delete any Content, in whole or in part, that in Our sole judgment violates these App Terms and Conditions or may harm the reputation of the App or Ours or Our partners.
By publishing Content on the App, You automatically grant Us and to Our partners, affiliates, licensees, successors and assigns, an irrevocable, perpetual, non-exclusive, transferable, sub-licensable, fully paid-up/royalty-free, worldwide right and license to (i) use, copy, store, perform, display, reproduce, record, play, adapt, modify and distribute the Content, (ii) prepare derivative works of the Content or incorporate the Content into other works, and (iii) grant and authorize sublicenses of the foregoing in any media now known or hereafter created. You represent and warrant that any such publishing and/or use of Your Content will not infringe or violate the rights of any third party.
You shall not publish, upload, modify, display, publish, transmit, update, share or otherwise make available Content that:
advocates harassment or intimidation of another person;
relates to or promotes or encourages money laundering, sex trafficking or gambling;
requests money from, or is intended to otherwise defraud, other users of the App;
involves the transmission of “junk mail”, “chain letters,” or “spamming” or similar activities;
promotes racism, bigotry, hatred or physical harm or injury of any kind against any religion, group, community or individual or is offensive, false, misleading, untrue, unlawful, illegal, defamatory, harassing, disparaging, obscene, sexually explicit, blasphemous, scandalous, libelous, threatening, abusive, hateful, harmful, bigoted, racially offensive, invasive of privacy right of any person, or otherwise objectionable or inappropriate;
belongs to another person and to which You are already aware that the same does not belong to You or that You do not have any right to the same;
is an illegal or unauthorized copy of another person’s copyrighted work;
contains video, audio, photographs or images of a person without his or her permission (or in the case of a minor, the minor’s legal guardian);
contains unauthorised, restricted or password only access pages or hidden pages or images;
contains or disseminates viruses, time bombs, trojan horses, worms or other harmful or disruptive codes, components or devices;
impersonates, or otherwise misrepresents affiliation, connection or association with, any person or entity;
provides information or data You do not have a right to make available under law or under contractual or fiduciary relationships (such as inside information, proprietary and confidential information);
disrupts the normal flow of communication between App users or otherwise negatively affects a users’ ability to engage in real time communication through the App;
solicits passwords or personal identifiable information for commercial, unauthorised or unlawful purposes from other users or disseminates another person’s personal information without his or her permission;
contains any advertising or commercial messages not expressly permitted under these App Terms and Conditions;
infringes upon or violates any third party's right to privacy, including any intellectual property rights;
hinders the App functionality in any way or interferes or affects other App users’ use and enjoyment of the App; or (xviii) violates any applicable law for the time being in force.
We reserve the right, in Our sole discretion, to investigate and take any legal action against anyone who violates this Clause 11.7, including deleting or removing the offending Content from the App and/or terminating or suspending the App account of such violating user. Whilst We reserve Our right to delete or remove such Content, We do not guarantee that such offensive Content will be removed or deleted. Failure by Us to remove or delete such Content does not waive Our right to remove or delete the same in subsequent or similar cases.

Your use of the App, including all Content You publish, must comply with all applicable laws and regulations. You agree that We may access, preserve and disclose Your account information and Content if required to do so by law or in a good faith belief that such access, preservation or disclosure is reasonably necessary, such as to: (i) comply with applicable laws, requests or orders from law enforcement agencies, appropriate competent authorities or for any legal process or proceeding; (ii) protect or defend Ours, or any third party's rights or property; (iii) enforce these App Terms and Conditions, Privacy Policy and Other Policies; (iii) in support of any fraud/ legal investigation/ verification checks; or (iv) respond to Your requests for customer service or allow You to use the App in the future.
We assume no responsibility or liability for any deletion of or failure to store any of Your Content.
1. MODIFICATIONS TO THE APP
We reserve the right at any time to modify or discontinue, temporarily or permanently, the App (or any part thereof) with or without notice. You agree that We shall not be liable to You or to any third party for any modification, suspension or discontinuance of the App. Any access or usage by You of the App shall imply that You have accepted any new or modified terms and conditions. Please re-visit these App Terms and Conditions from time to time to stay abreast of any changes that We may introduce.

         </Text>
        <Text style={styles.mediumTextStyle}>DISCLAIMER OF WARRANTY</Text>
         <Text style={styles.smallTextStyle}>
To the maximum extent permitted by applicable law, We have provided the App on an "AS IS" and "AS AVAILABLE" and “BEST EFFORTS” basis and grant no warranties of any kind, whether express, implied, direct, indirect statutory or otherwise with respect to the App or any part thereof (including all content contained therein), including any implied warranties of correctness, validity, accuracy, completeness, appropriateness, fitness, compatibility for a particular purpose or outcome or non-infringement. We do not warrant that the use of the App will always be secured, uninterrupted, available, error-free or will meet Your requirements or expectations, or that any defects in the App will be corrected or result in the desired results. We disclaim liability for, and no warranty is made with respect to, the connectivity and availability of the App at all times and the results of the use of the App.
Opinions, advice, statements, offers, or other information or content made available through the App, but not directly by Us, are those of their respective authors, and should not necessarily be relied upon. Such authors are solely responsible for such Content. We do not (i) guarantee the accuracy, completeness or usefulness of any information provided on the App, or (ii) adopt, endorse or accept responsibility for the accuracy or reliability of any opinion, advice, or statement made by any party other than Us.
From time to time, We may offer new features or tools which Our App users may experiment or experience. Such features or tools are offered solely for experimental purposes and without any warranty of any kind, and may be modified or discontinued at Our sole discretion. The provisions of this Disclaimer of Warranty section shall apply with full force to such features and tools.
We accept no responsibility for any damage, loss, liabilities, injury or disappointment incurred or suffered by You as a result of the App.
         </Text>
        <Text style={styles.mediumTextStyle}>LIMITATION OF LIABILITY</Text>
         <Text style={styles.smallTextStyle}>
To the maximum extent permitted by applicable law, in no event will We be liable for any incidental, special, consequential or indirect damages arising out of or relating to the use or inability to use the App, result of using the App, including without limitation, damages for recommendation of the App, loss or corruption of data or programs, service interruptions and procurement of substitute services, even if we know or have been advised of the possibility of such damages. To the maximum extent permitted by applicable law, under no circumstances will we be liable for any liquidated or punitive damages.
To the maximum extent permitted by applicable law, in no event will We be liable for any damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, liquidated, punitive arising out of or relating to recommendation of the App, the conduct of any App user or anyone else in connection with the use of the App, including without limitation, bodily injury, emotional distress, financial loss and/or any other damages resulting from communications with other App users or as a result of using the App.
         </Text>
        <Text style={styles.mediumTextStyle}>INDEMNIFICATION</Text>
         <Text style={styles.smallTextStyle}>
You agree to indemnify, defend and hold Us harmless, as well as Our partners, affiliates, subsidiaries, and each of their respective officers, directors, employees, agents, consultants and other related or affiliated third parties, from and against any and all losses, claims, costs, liabilities and expenses (including reasonable attorneys’ fees) relating to or arising out of Your use of the App, including but not limited to (i) any violation by You of these App Terms and Conditions, or (ii) any action arising from the Content that You publish on the App or using the App that infringes any proprietary or intellectual property rights (e.g. copyright, trade secrets, trademark or patent) of any third party, or (iii) any content or communication that denigrates, libels or invades the privacy right of any third party. We reserve the right, at Our own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by You, and You will co-operate fully in asserting any available defenses in such case.

         </Text>
        <Text style={styles.mediumTextStyle}>CAUTION</Text>
         <Text style={styles.smallTextStyle}>
We may check new user account profiles strictly for verifying accuracy of profile information and any unsuitable, objectionable or inappropriate content. However, We may not be able to verify the identity of all such users or the accuracy of their content, nor can We guarantee that We will be able to identify all unsuitable, objectionable or inappropriate content. Please do not take any user content as fully accurate and/or complete. We will not be liable or responsible for any false and misleading content and information given by any user. If You have any concerns over any user content, please write to us on support@stepsetgo.com with the details thereof.
You hereby acknowledge and agree that You shall ensure that at all times Your interaction with other users of the App will always be lawful and appropriate and that You alone shall be responsible for all consequences thereof.
         </Text>
        <Text style={styles.mediumTextStyle}>MISCELLANEOUS</Text>
         <Text style={styles.smallTextStyle}>
Entire Agreement: These App Terms and Conditions constitutes the entire agreement between You and Us regarding the subject matter hereof, and replaces and supersedes any and all prior agreements/ understandings/ correspondences, whether written or oral, between You and Us.
Amendment: We reserve the right to amend these App Terms and Conditions from time to time. Any such amendments will be applicable to all persons viewing/accessing/using the App once the revisions have been posted onto the same. You should therefore check the App from time to time to review the current App Terms and Conditions as applicable to You.
Survival: Termination or suspension of Your App Account shall not affect those provisions hereof that by their nature are intended to survive such termination or suspension.
Governing Law and Jurisdiction: These App Terms and Conditions shall be governed and construed in accordance with the laws of India and shall be subject to the exclusive jurisdiction of any competent courts situated at Mumbai.
No Assignment: These App Terms and Conditions are personal to You. You cannot assign Your rights or obligations hereunder, whether partly or fully, to anyone.
Severability: If any provisions of these App Terms and Conditions are held invalid or unenforceable under applicable law, such provision will be inapplicable, but the remainder will continue in full force and effect.
Waiver: No waiver of any term, provision or condition of these App Terms and Conditions whether by conduct or otherwise in any one or more instances shall be deemed to be or construed as a further or continuing waiver of any such term, provision or condition or of any other term, provision or condition of these App Terms and Conditions.
         </Text>
        <Text style={styles.mediumTextStyle}>CHANGES</Text>
         <Text style={styles.smallTextStyle}>
We may occasionally update these App Terms and Conditions. When We post any changes, We will revise the "last updated" date. We recommend that You check Our App from time to time to keep Yourself updated of any changes in this App Terms and Conditions or any of Our Policies.

         </Text>
        <Text style={styles.mediumTextStyle}>1. GRIEVANCE OFFICER</Text>
         <Text style={styles.smallTextStyle}>
In accordance with Information Technology Act, 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:

Name: Mr. Piyush Arora Email: support@stepsetgo.com
         </Text>
        <Text style={styles.mediumTextStyle}>1. CONTACT US</Text>
         <Text style={styles.smallTextStyle}>
Please contact Us by email on support@stepsetgo.com for any questions or comments regarding these App Terms and Conditions.

Last Updated on: April 20th, 2018.
         </Text>
		</ScrollView>
		<View style={styles.buttonContainerStyle}>
		 <RoundButton title="Close" style={styles.buttonStyle} onPress={()=>{props.navigation.navigate('HomeScreen')}}/>
        </View>
		</View>
	);
};

const styles = StyleSheet.create({
	termsAndConditionsContainerStyle: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent : 'center'
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
		fontSize: moderateScale(40, 0.8),
		color: 'springgreen'
	},
	mediumTextStyle: {
		padding: '3%',
		fontSize: moderateScale(17, 0.8),
		color: 'springgreen'
	},
	smallTextStyle: {
		padding: '3%',
		fontSize: moderateScale(10, 0.8),
		color: 'springgreen'
	}
});

export default TermsAndConditions;