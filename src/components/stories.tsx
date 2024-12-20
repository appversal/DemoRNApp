import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CampaignStory, UserData } from '../sdk';
import { UserActionTrack } from '../utils/trackuseraction';

type RootStackParamList = {
  StoryScreen: {
    storySlideData: CampaignStory;
    storyCampaignId: string;
    user_id: string;
    initialGroupIndex: number;
  };
};

const Stories: React.FC<UserData> = ({ campaigns, user_id }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const data = campaigns.find((val) => val.campaign_type === 'STR') as CampaignStory;

  function onNavigate(data: CampaignStory, groupIndex: number) {
    navigation.navigate('StoryScreen', {
      storySlideData: data,
      storyCampaignId: data.id,
      user_id,
      initialGroupIndex: groupIndex
    });
  }

  useEffect(() => {
    if (data && data.id) {
      UserActionTrack(user_id, data.id, 'IMP');
    }
  }, [data, user_id]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.details && Array.isArray(data.details) ? (
          data.details.map((storyGroup, index) => (
            <View key={index} style={styles.storyContainer}>
              <View style={styles.storyWrapper}>
                <TouchableWithoutFeedback onPress={() => {
                  onNavigate(data, index)
                  UserActionTrack(user_id, data.id, 'CLK');
                }}>
                  <View style={[styles.thumbnailContainer, { borderColor: storyGroup.ringColor }]}>
                    <Image source={{ uri: storyGroup.thumbnail }} style={styles.thumbnail} />
                  </View>
                </TouchableWithoutFeedback>
                <Text style={{
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: '500',
                  color: storyGroup.nameColor,
                  textAlign: 'center',
                }}
                >{storyGroup.name}</Text>
              </View>
            </View>
          ))
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'green',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  storyContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 135,
    width: 98,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
  },
  storyWrapper: {
    marginTop: 6,
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnailContainer: {
    height: 82,
    width: 82,
    borderRadius: 45,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 35,
    overflow: 'hidden',
  },
  noDataText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Stories;
