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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type RootStackParamList = {
    PipScreen: {
        user_id: string;
        id: string;
        link: string | null;
        largeVideoUrl: string;
      };
};

const closeImage = require("../assets/images/close.png");
const shareImage = require("../assets/images/share.png");

export const PipScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { params } = useRoute<RouteProp<RootStackParamList, "PipScreen">>();
    const { height, width } = Dimensions.get("window");

    const [mute, setMute] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const close = () => {
        navigation.goBack();
    };

    const speaker = () => {
        setMute(!mute);
    }

    return (
        <>
            {
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "black",
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Video
                            repeat={true}
                            resizeMode="stretch"
                            muted={mute ? true : false}
                            source={{
                                uri: params.largeVideoUrl
                            }}
                            style={{
                                position: "absolute",
                                overflow: "hidden",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                        />
                    </View>

                    {/* Close button */}
                    <TouchableOpacity
                        onPress={close}
                        style={{
                            flex: 1,
                            position: "absolute",
                            top: Platform.OS === "ios" ? height * 0.1 : 25,
                            right: 25,
                        }}
                    >
                        <Image
                            source={require("../assets/images/close.png")}
                            style={{
                                height: 20,
                                width: 20,
                            }}
                        />
                    </TouchableOpacity>
                    {/* Close button */}

                    {/* Speaker button */}
                    <TouchableOpacity
                        onPress={speaker}
                        style={{
                            flex: 1,
                            position: "absolute",
                            top: Platform.OS === "ios" ? height * 0.1 : 25,
                            left: 25,
                        }}
                    >
                        <Image
                            source={mute ? require("../assets/images/mute.png") : require("../assets/images/volume.png")}
                            style={{
                                height: 25,
                                width: 25,
                            }}
                        />
                    </TouchableOpacity>
                    {/* Speaker button */}

                    { params.link != null && params.link != "" && (
                        <View
                            style={{
                                display: "flex",
                                position: "absolute",
                                width: width,
                                justifyContent: "center",
                                alignItems: "center",
                                bottom:
                                    Platform.OS === "ios" ? height * 0.045 : height * 0.025,
                            }}
                        >
                            <TouchableWithoutFeedback
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 30,

                                }}
                                onPress={() => {
                                      if (params.link) {
                                        Linking.openURL(params.link);
                                      }
                                      UserActionTrack(params.user_id, params.id, "CLK");
                                }}
                            >
                                <Text style={{
                                    color: "black",
                                    fontWeight: "600",
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    height: 45,
                                    paddingVertical: 10,
                                    paddingHorizontal: 25,
                                }}>
                                    Continue
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </View>
            }
        </>
    );
};




// continue Button
// {data && data.details && data.details.link && (
//     <View
//       style={{
//         display: "flex",
//         position: "absolute",
//         width: width,
//         justifyContent: "center",
//         alignItems: "center",
//         bottom:
//           Platform.OS === "ios" ? height * 0.045 : height * 0.025,
//       }}
//     >
//       <TouchableWithoutFeedback
//         style={{
//           backgroundColor: "white",
//           borderRadius: 30,

//         }}
//         onPress={() => {
//           if (data.details.link) {
//             Linking.openURL(data.details.link);
//           }
//           UserActionTrack(user_id, data.id, "CLK");
//         }}
//       >
//         <Text style={{
//           color: "black",
//           fontWeight: "600",
//           textAlign: 'center',
//           textAlignVertical: 'center',
//           height: 45,
//           paddingVertical: 10,
//           paddingHorizontal: 25,
//         }}>
//           Continue
//         </Text>
//       </TouchableWithoutFeedback>
//     </View>
//   )}