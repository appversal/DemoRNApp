import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { UserActionTrack } from "../utils/trackuseraction"; // Import the tracking function
import { CampaignFloater, UserData } from "../sdk";
import RNFS from "react-native-fs";

export type FloaterProps = {
  access_token: string;
} & UserData;

const Floater: React.FC<FloaterProps> = ({
  access_token,
  campaigns,
  user_id,
}) => {
  const { width } = Dimensions.get("window");

  const data = campaigns.find(
    (val) => val.campaign_type === "FLT",
  ) as CampaignFloater;

  const [imagePath, setImagePath] = React.useState<string | null>(null);

  const downloadImage = async (url: string) => {
    const filename = url.split("/").pop()?.split("?")[0];
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: `${RNFS.DocumentDirectoryPath}/${filename}`,
      }).promise;
      if (downloadResult.statusCode === 200) {
        console.log("Image downloaded!");
      } else {
        console.error("Failed to download image:", downloadResult);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const checkCacheForImage = async (url: string) => {
    const filename = url.split("/").pop()?.split("?")[0];
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        setImagePath(path);
      } else {
        await downloadImage(url);
        setImagePath(path);
      }
    } catch (error) {
      console.error("Error checking cache for image:", error);
    }
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    checkCacheForImage(data.details.image);
    const trackImpression = async () => {
      try {
        await UserActionTrack(user_id, data.id, "IMP");
      } catch (error) {
        console.error("Error in tracking impression:", error);
      }
    };

    trackImpression();
  }, [data, user_id, access_token]);

  return (
    <>
      {data && data.details && data.details.image !== "" && (
        <View style={{
          position: "absolute",
    // top: 0,
    // left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    marginRight: 16 + width * 0.15,
    marginBottom: 16,
    zIndex: 10, 
        }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={async () => {
              if (data.details.link) {
                Linking.openURL(data.details.link);
              }
              try {
                await UserActionTrack(user_id, data.id, "CLK");
              } catch (error) {
                console.error("Error in tracking click:", error);
              }
            }}
            style={{
              width: width * 0.15,
              height: width * 0.15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              position: "absolute",
              // right: 20,
              // bottom: 20,
              overflow: "hidden",
              borderRadius: 100,
            }}
          >
            <Image
              source={{ uri: `file://${imagePath}` }}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default Floater;
