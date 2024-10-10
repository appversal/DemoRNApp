/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-shadow */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStorys, Stories, StoryScreen, UserData, Floater, Banner, Pip } from '@appstorys/appstorys-react-native';

const appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
const accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
const screenName = 'Home Screen';
const user_id = 'sf1rdsf1-sdfsf1-esf1';
const attributes = {
  key: 'value',
};

const Screen: FC = () => {
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
      <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
      <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
      <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
      </>
  )

  // return <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />;
  // return (
  //   <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
  // );
  // return (
  //   <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id}/>
  // );
  // return (
  //   <Stories campaigns={data.campaigns} user_id={data.user_id} />
  // );
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Tabs: FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarIcon: () => null, // This removes the icon
        }}
        name="AppStorys" component={Screen} />
    </Tab.Navigator>
  );
};

const App: FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
          <Stack.Screen name="StoryScreen" component={StoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;