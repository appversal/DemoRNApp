import { FC, useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { AppStorys, Stories, Pip, StoryScreen, Banner, Floater, UserData } from '@appstorys/appstorys-react-native';
import { AppStorys, Stories, Pip, StoryScreen, Banner, Floater, UserData } from './src/index';
import { Button, View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Animated } from 'react-native';

// import Banner from './src/components/banner';
// import Floater from './src/components/floater';
// import Pip from './src/components/pip';
// import Stories from './src/components/stories';
// import { StoryScreen } from './src/components/storyscreen';
// import AppStorys from './src/sdk';
// import { UserData } from './src/sdk';
// import myStore from './src/store/store.js';

// const appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
const appId = 'ac4bcd63-9442-47e5-963d-6bd12d96d5a6';
// const accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
const accountId = 'cc1bd25f-3998-4af5-89e0-f0e14f2624b6';
const screenName = 'Home Screen';
const user_id = 'adc3354364wsbvdsx';
const attributes = {
  key: 'value',
};

const Demo1
  = () => {
    const { width, height } = Dimensions.get('window');

    // For sidebar
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-width)); // Sidebar off-screen

    const [storiesVisible, setStoriesVisible] = useState(false);
    const [pipVisible, setPipVisible] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [floaterVisible, setFloaterVisible] = useState(false);

    const navigation = useNavigation<NavigationProp<any>>();

    // Function to toggle the sidebar
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
      Animated.timing(slideAnim, {
        toValue: sidebarVisible ? -width : 0, // Slide in or out
        duration: 300,
        useNativeDriver: false,
      }).start();
    };
    // For sidebar

    const earningsData = [
      { platform: 'Upwork', amount: '3,000', color: '#e0533d', smallColor: '#f7d4ce', letter: 'U' },
      { platform: 'Freepik', amount: '2,500', color: '#e78c9d', smallColor: '#f8dce1', letter: 'F' },
      { platform: 'Fiverr', amount: '2,000', color: '#377cc8', smallColor: '#c3d7ee', letter: 'W' },
      { platform: 'Github', amount: '1,800', color: '#e0533d', smallColor: '#f7d4ce', letter: 'G' },
    ];

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

    // const {
    //   getFormData
    // } = store();

    return (
      <>
        <ScrollView>
          <View
            style={{
              flex: 1,
            }}
          >

            <TouchableOpacity
              onPress={toggleSidebar}
              activeOpacity={1}>
              <Image
                source={require('./assets/imagetop.png')}
                style={{
                  marginTop: 6,
                  height: width * 0.183,
                  width: width * 0.98,
                }}
              />
            </TouchableOpacity>

            {
              storiesVisible &&
              <View style={{
                marginTop: 6,
              }}>
                <Stories campaigns={data.campaigns} user_id={data.user_id} />
              </View>
            }


            <Image
              source={require('./assets/imagebottom.png')}
              style={{
                height: width * 0.685,
                width: width * 0.98,
              }}
            />

            <View style={{
              // backgroundColor: 'green',
              marginTop: 6,
              paddingHorizontal: 24,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'black',
                fontSize: 22,
                fontWeight: '500',
              }}>Earnings</Text>
              <Text style={{
                color: '#489fcd',
                fontSize: 15,
                fontWeight: '800',
              }}>See All</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{
                height: 140,
                flexDirection: 'row',
                marginHorizontal: 12,
                marginTop: 12,
              }}>
                {earningsData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 10,
                      backgroundColor: item.color,
                      width: 130,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}>
                    <Text style={{
                      textAlignVertical: 'center',
                      textAlign: 'center',
                      borderRadius: 15,
                      width: 30,
                      height: 30,
                      marginTop: 18,
                      marginBottom: 26,
                      color: 'black',
                      backgroundColor: item.smallColor,
                      fontSize: 18,
                      fontWeight: '600',
                    }}>{item.letter}</Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 13,
                      marginBottom: 2,
                    }}>{item.platform}</Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 22,
                      fontWeight: '500',
                      marginBottom: 16,
                    }}>$ {item.amount}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <Image
              source={require('./assets/bottom.png')}
              style={{
                marginVertical: 28,
                marginHorizontal: 24,
                height: (width * 2.023) * 0.88,
                width: width * 0.88,
              }}
            />
          </View>
        </ScrollView>


        {/* Sidebar */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: width, // Sidebar covers full width
            backgroundColor: '#1e4e9b', // The blue background color
            transform: [{ translateX: slideAnim }],
            // paddingHorizontal: 20,
            paddingVertical: 40,
            zIndex: 99999999,
          }}
        >
          {/* Sidebar header with title and close button */}
          <View style={{
            marginHorizontal: 36,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontSize: 38, fontWeight: 'bold' }}>AppStorys</Text>
            <TouchableOpacity onPress={toggleSidebar}>
              <Image
                source={require('./assets/close.png')}
                style={{
                  height: 22,
                  width: 22,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Sidebar menu items */}
          <View style={{ marginTop: 40 }}>
            {['Stories', 'PIP Videos', 'Banners', 'Floaters',].map((item, index) => (
              <View key={index}>
                <View style={{
                  height: 1,
                  width: width,
                  backgroundColor: '#4f74b6',
                }}></View>
                <TouchableOpacity onPress={() => {
                  if (index === 0) {
                    setStoriesVisible(!storiesVisible);
                    setPipVisible(false);
                    setBannerVisible(false);
                    setFloaterVisible(false);
                    toggleSidebar();
                  } else if (index === 1) {
                    setPipVisible(!pipVisible);
                    setStoriesVisible(false);
                    setBannerVisible(false);
                    setFloaterVisible(false);
                    toggleSidebar();
                  } else if (index === 2) {
                    setBannerVisible(!bannerVisible);
                    setStoriesVisible(false);
                    setPipVisible(false);
                    setFloaterVisible(false);
                    toggleSidebar();
                  } else if (index === 3) {
                    setFloaterVisible(!floaterVisible);
                    setPipVisible(false);
                    setStoriesVisible(false);
                    setBannerVisible(false);
                    toggleSidebar();
                  }
                }}>
                  <View style={{
                    height: 28,
                  }}></View>
                  <Text style={{
                    color: 'white',
                    fontSize: 20,
                    marginHorizontal: 36,
                  }}>{item}</Text>
                  <View style={{
                    height: 28,
                  }}></View>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{
              height: 1,
              width: width,
              backgroundColor: '#4f74b6',
            }}></View>
          </View>

          {/* Sidebar footer with Contact Us */}
          <View style={{
            width: width,
            position: 'absolute',
            bottom: 40,
            alignItems: 'center',
          }}>
            <TouchableOpacity onPress={() => navigation.navigate('ContactUs')}>
              <View>
                <Image
                  source={require('./assets/contactus.png')}
                  style={{
                    height: 15,
                    width: 99,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* Sidebar */}

        {
          pipVisible && 
          <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        }

        {
          bannerVisible &&
          <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        }

        {
          floaterVisible &&
          <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        }

      </>
    );
  }

export default Demo1


{/* <Stories campaigns={data.campaigns} user_id={data.user_id} /> */ }
{/* <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} /> */ }

// </View>
// </ScrollView>
{/* <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
            <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id}/> */}