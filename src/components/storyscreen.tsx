import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Share,
  PanResponder,
  Platform,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Video from "react-native-video";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { UserActionTrack } from "../utils/trackuseraction";
import { CampaignStory } from "../sdk";

type StorySlide = CampaignStory["details"][0]["slides"][0] & {
  finish: number;
};

type StoryGroup = CampaignStory["details"][0] & {
  slides: StorySlide[];
};

export interface StoriesProps {
  data: {
    id: string;
    details: StoryGroup[];
  };
}

// type RootStackParamList = {
//   StoryScreen: {
//     storySlideData: CampaignStory;
//     storyCampaignId: string;
//     user_id: string;
//   };
// };

type RootStackParamList = {
  StoryScreen: {
    storySlideData: CampaignStory;
    storyCampaignId: string;
    user_id: string;
    initialGroupIndex: number; // Add this to track which group to start with
  };
};

const closeImage = require("../assets/images/close.png");
const shareImage = require("../assets/images/share.png");

export const StoryScreen = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // navigation.setOptions;
  // const { params } = useRoute<RouteProp<RootStackParamList, "StoryScreen">>();
  // const { height, width } = Dimensions.get("window");

  // const [content, setContent] = useState<StorySlide[]>([]);

  // const [currentStorySlide, setCurrentStorySlide] = useState(0);

  // useEffect(() => {
  //   setCurrentStorySlide(0);
  //   console.log(params);

  //   if (!params) {
  //     return;
  //   }

  //   // if (params && params.storyCampaignId) {
  //   //   UserActionTrack(user_id, params.storyCampaignId, 'IMP', params.storySlideData.slides[currentStorySlide].id);
  //   // }
  //   const slides = params.storySlideData.details[current].slides;
  //   // Transform the storySlideData to add the 'finish' field to each element
  //   const transformedData = slides.map((storySlide) => ({
  //     ...storySlide, // Keep the existing properties
  //     finish: 0, // Add the 'finish' property with value 0
  //   }));

  //   // Set the transformed data to the state
  //   setContent(transformedData);

  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [params, navigation]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, "StoryScreen">>();
  const { height, width } = Dimensions.get("window");

  const [content, setContent] = useState<StorySlide[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [current, setCurrent] = useState(0);
  const [currentStorySlide, setCurrentStorySlide] = useState(0);
  const [, setVideoDuration] = useState(5);
  

  useEffect(() => {
    if (!params) return;

    // Initialize with the clicked group index
    setCurrentGroupIndex(params.initialGroupIndex);
    loadStoryGroup(params.initialGroupIndex);
    
    navigation.setOptions({
      headerShown: false,
    });
  }, [params, navigation]);

  const loadStoryGroup = (groupIndex: number) => {
    if (!params?.storySlideData?.details[groupIndex]) {
      close();
      return;
    }

    const slides = params.storySlideData.details[groupIndex].slides;
    const transformedData = slides.map((storySlide) => ({
      ...storySlide,
      finish: 0,
    }));

    setContent(transformedData);
    setCurrent(0);
    setCurrentStorySlide(0);
  };

  // Share function
  const shareContent = async () => {
    try {
      await Share.share({
        message: "Check this out: " + content[current]?.link,
        url: content[current]?.content ?? undefined,
      });
    } catch (error) {
      console.error("Error sharing content: ", error);
    }
  };

  const progress = useRef(new Animated.Value(0)).current;

  // const start = (duration: number) => {
  //   if (params?.storySlideData?.details[current].slides?.[currentStorySlide]?.id !== undefined) {
  //     if (params?.storyCampaignId) {
  //       UserActionTrack(
  //         user_id,
  //         params.storyCampaignId,
  //         "IMP",
  //         params.storySlideData.details[current].slides[currentStorySlide]?.id ?? "",
  //       );
  //       setCurrentStorySlide(currentStorySlide + 1);
  //     }
  //   }

  //   console.log(`Starting animation for ${duration / 1000} seconds`);

  //   Animated.timing(progress, {
  //     toValue: 1,
  //     duration: duration,
  //     useNativeDriver: false,
  //   }).start(({ finished }) => {
  //     if (finished) {
  //       next();
  //     }
  //   });
  // };

  // const next = () => {

  //   if (current !== content.length - 1) {
  //     let tempData = [...content];
  //     if (tempData[current]) {
  //       tempData[current].finish = 1;
  //     }
  //     setContent(tempData);
  //     // Uncomment this line plz
  //     setCurrent(current + 1);
  //     progress.setValue(0);
  //     // console.log("Current : ", content);
  //   } else {
  //     close();
  //   }
  // };

  // const previous = () => {
  //   if (currentStorySlide > 0) {
  //     setCurrentStorySlide(currentStorySlide - 1);
  //   }
  //   if (current - 1 >= 0) {
  //     let tempData = [...content];
  //     if (tempData[current]) {
  //       tempData[current].finish = 0;
  //     }
  //     setContent(tempData);
  //     progress.setValue(0);
  //     setCurrent(current - 1);
  //   }
  // };

  const start = (duration: number) => {
    if (params?.storySlideData?.details[currentGroupIndex].slides?.[currentStorySlide]?.id) {
      if (params?.storyCampaignId) {
        UserActionTrack(
          params.user_id,
          params.storyCampaignId,
          "IMP",
          params.storySlideData.details[currentGroupIndex].slides[currentStorySlide]?.id ?? "",
        );
        setCurrentStorySlide(currentStorySlide + 1);
      }
    }

    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        next();
      }
    });
  };

  const next = () => {
    if (current !== content.length - 1) {
      let tempData = [...content];
      if (tempData[current]) {
        tempData[current].finish = 1;
      }
      setContent(tempData);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      // Move to next story group
      const nextGroupIndex = currentGroupIndex + 1;
      if (nextGroupIndex < params!.storySlideData.details.length) {
        setCurrentGroupIndex(nextGroupIndex);
        loadStoryGroup(nextGroupIndex);
      } else {
        close();
      }
    }
  };

  const previous = () => {
    if (current > 0) {
      let tempData = [...content];
      if (tempData[current]) {
        tempData[current].finish = 0;
      }
      setContent(tempData);
      progress.setValue(0);
      setCurrent(current - 1);
    } else if (currentGroupIndex > 0) {
      // Move to previous story group
      const prevGroupIndex = currentGroupIndex - 1;
      setCurrentGroupIndex(prevGroupIndex);
      const prevGroupSlides = params!.storySlideData.details[prevGroupIndex].slides;
      loadStoryGroup(prevGroupIndex);
      setCurrent(prevGroupSlides.length - 1);
    }
  };

  const close = () => {
    console.log("Close function called");
    progress.setValue(0);
    navigation.goBack();
  };

  // PanResponder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          close();
        }
      },
    }),
  ).current;

  if (!params) {
    return (
      <View style={{ backgroundColor: "black" }}>
        <Text style={{ color: "white", fontSize: 14 }}>No data available</Text>
      </View>
    );
  }

  const { storySlideData, user_id } = params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingTop: Platform.OS === "ios" ? height * 0.07 : height * 0.02,
        paddingBottom: height * 0.1,
      }}
      {...panResponder.panHandlers} // Attach PanResponder handlers
    >
      {content &&
        content.length !== 0 &&
        typeof content[current]?.image === "string" &&
        content[current]?.image !== "" && (
          <Image
            source={{ uri: content[current]?.image! }}
            onLoadEnd={() => {
              progress.setValue(0);
              start(5000); // Image lasts 5 seconds
            }}
            style={{
              height: "100%",
              width: width,
              resizeMode: "cover",
              top: 0,
            }}
          />
        )}
      {content &&
        content.length !== 0 &&
        typeof content[current]?.video === "string" &&
        content[current]?.video !== "" && (
          <Video
            source={{ uri: content[current]?.video! }}
            style={{ height: "100%", width: width }}
            resizeMode="cover"
            onLoad={(data) => {
              console.log("Video loaded with duration:", data.duration);
              setVideoDuration(data.duration);
              progress.setValue(0);
              start(data.duration * 1000); // Start based on video duration
            }}
            onError={(error) => console.error("Video error:", error)}
            onEnd={next} // Move to next content when video ends
            paused={false}
          />
        )}

      <View
        style={{
          width: width - 5,
          position: "absolute",
          top: Platform.OS === "ios" ? height * 0.08 : height * 0.03,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {content.map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              flex: 1,
              height: 3,
              backgroundColor: "grey",
              marginLeft: 5,
              borderRadius: 2,
            }}
          >
            <Animated.View
              style={{
                flex:
                  current === index ? progress : (content[index]?.finish ?? 1),
                height: 3,
                borderRadius: 2,
                backgroundColor: "rgba(211, 202, 202, 1)",
              }}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          width: width,
          height: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          top: Platform.OS === "ios" ? height * 0.094 : height * 0.045,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: 26,
            paddingLeft: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {/* {storySlideData &&
              storySlideData.details[current].thumbnail &&
              storySlideData.details[current].thumbnail != "" && (
                <Image
                  source={{ uri: storySlideData.details[current].thumbnail }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              )} */}
              {
              params?.storySlideData?.details[currentGroupIndex].thumbnail && (
                <Image
                  source={{ uri: params?.storySlideData?.details[currentGroupIndex].thumbnail }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              )}
            {/* {storySlideData &&
              storySlideData.details[current].name &&
              storySlideData.details[current].name != "" && (
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: 15,
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  {storySlideData.details[current].name}
                </Text>
              )} */}
              {params?.storySlideData?.details[currentGroupIndex].name && (
        <Text style={{
          marginLeft: 12,
          fontSize: 15,
          fontWeight: "500",
          color: "white",
        }}>
          {params.storySlideData.details[currentGroupIndex].name}
        </Text>
      )}
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              bottom: 2,
            }}
          >
            <TouchableOpacity onPress={shareContent} style={{}}>
              <Image
                source={shareImage}
                style={{
                  height: 20,
                  width: 20,
                  margin: 16,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={close} style={{}}>
              <Image
                source={closeImage}
                style={{
                  height: 18,
                  width: 18,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: height * 0.15,
          width: width,
          height: height,
          position: "absolute",
          top: 0,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ width: "50%", height: "100%" }}
          onPress={previous}
        />
        <TouchableOpacity
          style={{ width: "50%", height: "100%" }}
          onPress={next}
        />
      </View>

      {content &&
        content[current] &&
        content[current]?.button_text &&
        content[current]?.link && (
          <View
            style={{
              position: "absolute",
              bottom: height * 0.037,
              width: width,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (typeof content[current]?.link === "string") {
                  Linking.openURL(content[current]?.link!);
                }
                if (params && params.storyCampaignId) {
                  UserActionTrack(
                    user_id,
                    params.storyCampaignId,
                    "CLK",
                    // params.storySlideData.slides[currentStorySlide]?.id ?? "",
                    content[current]?.id!,
                  );
                }
                // const fetchData = async () => {
                //   try {
                //     await UserActionTrack(user_id, storyCampaignId, 'CNV');

                //     // console.log(userTrackData);

                //   } catch (error) {
                //     console.error('Error in fetching data:', error);
                //   }
                // };

                // fetchData();
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  {content[current]?.button_text}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};
