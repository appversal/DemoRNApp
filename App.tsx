import {FC, useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
// import {AppStorys ,Stories, StoryScreen, Banner,Floater,UserData} from '@appstorys/appstorys-react-native';
import { AppStorys, Stories, Pip, StoryScreen, Banner, Floater, UserData } from './src/index';
import { Button , View, Text, Image, Dimensions, ScrollView} from 'react-native';

import Demo1 from './Demo1';
// import Demo2 from './Demo2';
// import Demo3 from './Demo3';
import ContactUs from './ContactUs';
import { PipScreen } from './src/components/pipscreen';
// import Demo4 from './Demo4';

// const appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
// const accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
// const screenName = 'Home Screen';
// const user_id = 'sf1rdsf1-sdfsf1-esf1';
// const attributes = {
//   key: 'value',
// };

const Demo1Screen: FC = () => {
  return (
    <Demo1/>
  )
  
};

// const Demo2Screen: FC = () => {
//   return (
//     <Demo2/>
//   );
// };

// const Demo3Screen: FC = () => {
//   return (
//     <Demo3/>
//   );
// };

// const Demo4Screen: FC = () => {
//   return (
//     <Demo4/>
//   );
// };

const ContactUsScreen: FC = () => {
  return (
    <ContactUs/>
  );
};


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom icon components for each tab
const homeIcon = require('./assets/icons/home.png');  // Adjust path
const homeIconFocused = require('./assets/icons/home_selected.png');  // Adjust path
const websiteIcon = require('./assets/icons/website.png');  // Adjust path
const linkedinIcon = require('./assets/icons/linkedin.png');  // Adjust path
const contactIcon = require('./assets/icons/contactus.png');  // Adjust path
const contactIconFocused = require('./assets/icons/contactus_selected.png');  // Adjust path


const Tabs: FC = () => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused ? homeIconFocused : homeIcon;
          } else if (route.name === 'Website') {
            iconSource = websiteIcon;
          } else if (route.name === 'Linkedin') {
            iconSource = linkedinIcon;
          } else if (route.name === 'Contact Us') {
            iconSource = focused ? contactIcon : contactIcon;
          }

          // Return the Image component with the selected icon
          return (
            <Image
              source={iconSource}
              style={{ width: 20, height: 20, tintColor: color }} // Use tintColor to apply color if needed
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={Demo1Screen}
        options={{ headerShown: false }}
      />
      
      <Tab.Screen
        name="Website"
        component={Demo1Screen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            openLink('https://appstorys.com/');
          },
        }}
      />

      <Tab.Screen
        name="Linkedin"
        component={Demo1Screen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            openLink('https://www.linkedin.com/company/appstorys/');
          },
        }}
      />

      <Tab.Screen
        name="Contact Us"
        component={ContactUs}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const App: FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Tabs screen */}
          <Stack.Screen 
            options={{headerShown: false}} 
            name="Appbar" 
            component={Tabs} 
          />
          {/* Other screens */}
          <Stack.Screen 
            name="StoryScreen" 
            component={StoryScreen} 
          />
          <Stack.Screen 
            name="PipScreen"
            component={PipScreen} 
          />
          {/* Add ContactUs screen here */}
          <Stack.Screen
          options={{
            // headerShown: false
            title: 'Contact Us',
          }}  
            name="ContactUs" 
            component={ContactUs} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;