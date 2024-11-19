import { StyleSheet, Text, View, Image,Dimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
// import {AppStorys, Pip ,Stories, StoryScreen, Banner,Floater,UserData} from '@appstorys/appstorys-react-native';
import { AppStorys, Stories, Pip, StoryScreen, Banner, Floater, UserData } from './src/index';
import EncryptedStorage from 'react-native-encrypted-storage';

// const appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
const appId = 'ac4bcd63-9442-47e5-963d-6bd12d96d5a6';
// const accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
const accountId = 'cc1bd25f-3998-4af5-89e0-f0e14f2624b6';
const screenName = 'Contact Us Screen';
const user_id = 'adc3354364wsbvdsx';
const attributes = {
  key: 'value',
};

const ContactUs = () => {

  const { width, height } = Dimensions.get('window');

  const [access_token, setAccess_token] = useState<string>();
    const [data, setData] = useState<UserData>();

    useEffect(() => {
      async function init() {
        await AppStorys.verifyAccount(accountId, appId);
        await AppStorys.trackScreen(appId, screenName);
        const verifyUser = await AppStorys.verifyUser(user_id);

        if (verifyUser) {
          setData(verifyUser);
        }
        await AppStorys.trackUser(user_id, attributes);
        const access_token = await EncryptedStorage.getItem('access_token');
        if (access_token) {
          setAccess_token(access_token);
        }
      }

      init();
    }, []);

    if (!data || !access_token) {
      return null;
    }

  return (
    <>
    <Stories campaigns={data.campaigns} user_id={data.user_id} />
    {/* <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} /> */}
    <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
    }}>
      
      <Image
              source={require('./assets/contactpage.png')}
              style={{
                height: (width * 1.935) * 0.9,
                width: width * 0.9,
              }}
            />
    </View>
    <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
    <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id}/>
    </>
  )
}

export default ContactUs