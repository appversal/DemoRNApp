import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
  Image,
  Platform,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Video from "react-native-video";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { UserActionTrack } from "../utils/trackuseraction";
import { CampaignPip, UserData } from "../sdk";
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get("window");

export type PipProps = {
  access_token: string;
} & UserData;

const Pip: React.FC<PipProps> = ({ access_token, campaigns, user_id }) => {
  // let pipBottomValue = height > 700 ? (Platform.OS === "ios" ? 220 : 220) : 220;
  let pipBottomValue = 220;

  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  const PIP_WIDTH = 140;
  const PIP_HEIGHT = 200;
  
  // Calculate the maximum x and y positions to keep PIP within screen bounds
  const MAX_X = width - PIP_WIDTH - 20;
  const MAX_Y = height - (tabBarHeight + PIP_HEIGHT) - 20;
  const MIN_X = 20;
  const MIN_Y = Platform.OS === "ios" ? 60 : 20;

  const [isPipVisible, setPipVisible] = useState(true);
  const [isExpanded, setExpanded] = useState(false);

  const [smallVideoPath, setSmallVideoPath] = useState("");
  const [largeVideoPath, setLargeVideoPath] = useState("");

  const initialX = width - 160
  const initialY = height - (tabBarHeight + pipBottomValue)

  const pan = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  useEffect(() => {
    pan.setOffset({ x: initialX, y: initialY });
  }, [])

  const data = campaigns.find(
    (val) => val.campaign_type === "PIP",
  ) as CampaignPip;

  const downloadVideo = async (url: string, filename: string) => {
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: `${RNFS.DocumentDirectoryPath}/${filename}`,
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log("Downloaded successfully");
      } else {
        console.log("Download failed");
      }
    } catch (error) {
      console.error("Error in downloading video:", error);
    }
  };

  const checkAndDownloadSmallVideo = async (url: string) => {
    try {
      const filename = url.split("/").pop()?.split("?")[0] as string;

      const fileExists = await RNFS.exists(
        `${RNFS.DocumentDirectoryPath}/${filename}`,
      );

      if (!fileExists) {
        await downloadVideo(url, filename);
        setSmallVideoPath(`${RNFS.DocumentDirectoryPath}/${filename}`);
      } else {
        setSmallVideoPath(`${RNFS.DocumentDirectoryPath}/${filename}`);
      }
    } catch (error) {
      console.error("Error in checking and downloading video:", error);
    }
  };
  const checkAndDownloadLargeVideo = async (url: string) => {
    try {
      const filename = url.split("/").pop()?.split("?")[0] as string;

      const fileExists = await RNFS.exists(
        `${RNFS.DocumentDirectoryPath}/${filename}`,
      );

      if (!fileExists) {
        await downloadVideo(url, filename);
        setLargeVideoPath(`${RNFS.DocumentDirectoryPath}/${filename}`);
      } else {
        setLargeVideoPath(`${RNFS.DocumentDirectoryPath}/${filename}`);
      }
    } catch (error) {
      console.error("Error in checking and downloading video:", error);
    }
  };

  useEffect(() => {
    if (data && data.id) {
      UserActionTrack(user_id, data.id, "IMP");
      const smallVideoUrl = data.details.small_video;
      checkAndDownloadSmallVideo(smallVideoUrl);
    }
    navigation.setOptions({
      tabBarStyle: { display: isExpanded ? "none" : "flex" },
      headerShown: false,
    });
  }, [isExpanded, navigation, user_id, access_token]);

  const closePip = () => {
    setPipVisible(false);
    setExpanded(false);
  };

  const expandPip = () => {
    setExpanded(true);
    checkAndDownloadLargeVideo(data.details.large_video);
    pan.setOffset({ x: 0, y: 0 });
  };

  const constrainPosition = (x: number, y: number) => {
    return {
      x: Math.min(Math.max(x, MIN_X), MAX_X),
      y: Math.min(Math.max(y, MIN_Y), MAX_Y),
    };
  };

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: pan.x,
          translationY: pan.y,
        },
      },
    ],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const {  absoluteX, absoluteY, x, y, } = event.nativeEvent;

      const constrainedPosition = constrainPosition(absoluteX - x, absoluteY - y);

      pan.setOffset(constrainedPosition);
      pan.setValue({ x: 0, y: 0 });
  
    }
  };

  return (
    <GestureHandlerRootView style={{
      position: 'absolute',
      zIndex: 999998,
    }}>
      {data && isPipVisible && (
        <PanGestureHandler
          onGestureEvent={isExpanded ? undefined : onPanGestureEvent}
          onHandlerStateChange={isExpanded ? undefined : onHandlerStateChange}
        >
          <Animated.View
            style={[
              isExpanded
                ? styles.floaterExpandedContainer
                : styles.floaterContainer,
              {
                transform: [
                  {
                    translateX: pan.x
                  },
                  {
                    translateY: pan.y
                  },
                ],
              },
            ]}
          >
            <View onTouchEnd={expandPip} style={{ flex: 1 }}>
              {data.details.small_video &&
                data.details.large_video && (
                  <Video
                    repeat={true}
                    resizeMode="stretch"
                    muted={true}
                    source={{
                      uri: isExpanded
                        ? `file://${largeVideoPath}`
                        : `file://${smallVideoPath}`,
                    }}
                    style={{
                      borderRadius: isExpanded ? 0 : 15,
                      position: "absolute",
                      overflow: "hidden",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                  />
                )}
            </View>

            <TouchableOpacity
              onPress={closePip}
              style={
                isExpanded
                  ? styles.expandedClosePipButton
                  : styles.closePipButton
              }
            >
              <Image
                source={require("../assets/images/close.png")}
                style={
                  isExpanded
                    ? styles.expandedClosePipButtonText
                    : styles.closePipButtonText
                }
              />
            </TouchableOpacity>

            {data && data.details && data.details.link && (
              <View
                style={{
                  display: isExpanded ? "flex" : "none",
                  position: "absolute",
                  backgroundColor: "white",
                  width: width - 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 4,
                  bottom:
                    Platform.OS === "ios" ? height * 0.045 : height * 0.025,
                  left: 20,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (data.details.link) {
                      Linking.openURL(data.details.link);
                    }
                    UserActionTrack(user_id, data.id, "CLK");
                    // const fetchData = async () => {
                    //   try {
                    //     await UserActionTrack(data.id, user_id, 'CLK');
                    //   } catch (error) {
                    //     console.error('Error in fetching data:', error);
                    //   }
                    // };
                    // fetchData();
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Continue
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  closePipButton: {
    padding: 5,
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "black",
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closePipButtonText: {
    height: 8,
    width: 8,
  },
  expandedClosePipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.1 : 25,
    right: 25,
  },
  expandedClosePipButtonText: {
    height: 20,
    width: 20,
  },
  floaterContainer: {
    backgroundColor: "white",
    width: 140,
    height: 200,
    position: "absolute",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    zIndex: 999999, // Add a high zIndex
    elevation: 999999, // Add elevation for Android
  },
  floaterExpandedContainer: {
    paddingTop: Platform.OS === "ios" ? height * 0.07 : 0,
    paddingBottom: Platform.OS === "ios" ? height * 0.025 : 0,
    backgroundColor: "black",
    width: width,
    height: height,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    zIndex: 999999, // Add a high zIndex
    elevation: 999999, // Add elevation for Android
  },
  container: {
    flex: 1,
  },
});

export default Pip;
