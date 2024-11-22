import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet,
} from "react-native";

import RNFS from "react-native-fs";
import { UserActionTrack } from "../utils/trackuseraction";
import { CampaignBanner, UserData } from "../sdk";

export type BannerProps = {
  access_token: string;
} & UserData;

const Banner: React.FC<BannerProps> = ({
  access_token,
  campaigns,
  user_id,
}) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [imagePath, setImagePath] = useState<string | null>(null);

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
  const data = useMemo(
    () =>
      campaigns.find((val) => val.campaign_type === "BAN") as CampaignBanner,
    [campaigns],
  );

  useEffect(() => {
    if (data && data.id) {
      UserActionTrack(user_id, data.id, "IMP");
      checkCacheForImage(data.details.image);
    }
  }, [data, user_id, access_token]);

  const closeBanner = () => {
    setIsBannerVisible(false);
    // UserActionTrack(user_id, data.id, 'CLK');
  };

  const { width, height } = Dimensions.get("window");

  return (
    <>
      {data && data.details && data.details.image !== "" && isBannerVisible && (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              UserActionTrack(user_id, data.id, "CLK");
              if (data.details.link) {
                Linking.openURL(data.details.link);
              }
            }}
            style={[
              styles.banner,
              { width: width * 0.92, height: height * 0.1, borderRadius: 6,},
            ]}
          >
            <View style={[styles.banner, {borderRadius: 6,}]}>
            <Image
              source={{ uri: `file://${imagePath}` }}
              style={{ width: width * 0.92, height: height * 0.1, borderRadius: 6, }}
            />
            </View>
            <TouchableOpacity onPress={closeBanner} style={styles.closeButton}>
              <Image
                source={require("../assets/images/close.png")}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 16,
    zIndex: 10,  // Ensure the banner is on top
    
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 1)",
    position: "relative",
    // bottom: 16,
    overflow: "visible",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "black",
    borderRadius: 15,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: 8,
    width: 8,
  },
});

export default Banner;
