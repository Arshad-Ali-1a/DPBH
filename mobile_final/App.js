import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AnimatedLoader from "react-native-animated-loader";
import { Overlay } from "react-native-elements";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import ReceiveSharingIntent from "react-native-receive-sharing-intent";
import RNFetchBlob from "rn-fetch-blob";

const DARKNESS_DETECTION_URL = "http://192.168.1.36:8000/detect-darkness"; //! Change this to the backend API URL
// const DARKNESS_DETECTION_URL ="https://kuch-to-bhi.onrender.com/detect-darkness"; //! Change this to the backend API URL

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const useGetShare = () => {
  const [share, setShare] = useState(null);

  useEffect(() => {
    // To get All Recived Urls
    ReceiveSharingIntent.getReceivedFiles(
      (files) => {
        // files returns as JSON Array example
        //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
        console.log("Received Files", files);
        setShare(files);
      },
      // @ts-ignore
      (error) => {
        console.log(error);
      },
      "com.novas.novas" // share url protocol (must be unique to your app, suggest using your apple bundle id)
    );
  }, []);

  return share;
};

const YourComponent = () => {
  const [resultImage, setResultImage] = useState("");
  const [currentTab, setCurrentTab] = useState("Home");
  const [imageVisible, setImageVisible] = useState(false);
  const [loaderText, setLoaderText] = useState("Connecting to Servers");

  const scale = useRef(new Animated.Value(1)).current;
  let recievedFiles = useGetShare();
  console.log("Recieved Files to component", recievedFiles);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true,
    });

    // console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      setCurrentTab("Loading");
      sendImageToBackend(result.assets[0].base64);
    }
  };

  const sendImageToBackend = async (base64) => {
    // console.log("image recieved..", base64);
    let loaderTexts = [
      "Connecting to Servers",
      "Extracing Text Content",
      "Analyzing Text Content",
      "Highlighting Dark Patterns",
      "Rendering Results",
    ];

    let currentText = 0;
    const loaderInterval = setInterval(() => {
      setLoaderText(loaderTexts[currentText]);
      currentText += 1;

      if (currentText == loaderTexts.length) {
        currentText = 2;
      }
    }, 2000);

    // Call backend API here

    //write a fetch with post method, and send json data with base64 image to backend
    const darkResponse = await fetch(DARKNESS_DETECTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64 }),
    }).catch((error) => {
      console.log("Error occured while sending image to backend", error);
    });

    if (!darkResponse.ok) {
      console.log("Failed to get response from backend");
      console.log(darkResponse);
      setCurrentTab("Home");
    } else {
      const darkResponseJson = await darkResponse.json().catch((error) => {
        console.log("Error occured while sending image to backend", error);
      });
      console.log(Object.keys(darkResponseJson)); //["highlighted_img_data", "dark_patterns"]
      // console.log(darkResponseJson.highlighted_img_data);
      console.log(darkResponseJson.dark_patterns);
      setResultImage(darkResponseJson.highlighted_img_data);
      setImageVisible(true);
    }

    clearInterval(loaderInterval);

    //handle the failed response here..
  };

  //* image sharing handler....
  useEffect(() => {
    if (recievedFiles !== null && recievedFiles.length > 0) {
      console.log("Recieved Files in use effect: ", recievedFiles);

      // imgToBase64(recievedFiles.slice(-1)[0].contentUri)
      console.log("Content URI: ", recievedFiles.slice(-1)[0].filePath);
      RNFetchBlob.fs
        .readFile(recievedFiles.slice(-1)[0].contentUri, "base64")
        .then((fileBase64) => {
          console.log("Response: ", fileBase64.substr(0, 100), "...");
          setCurrentTab("Loading");
          sendImageToBackend(fileBase64);
        })
        .catch((error) => {
          console.log("Error occured while reading shared file", error);
        });

      // .then((dataUrl) => {
      //   console.log("Data URL: ", dataUrl);
      // })
      // .catch((error) => {
      //   console.log("Error occured while reading shared file", error);
      // });

      // sendImageToBackend(recievedFiles[0].base64);
    }
  }, [recievedFiles]);

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Image source={require("./assets/logo.png")} style={styles.icon} />
        <View>
          <Text style={styles.title}>N.O.V.A.S</Text>
          <Text style={styles.subtitle}>No Tricks, Just Transparency.</Text>
        </View>
      </View>

      {/* Middle Section */}
      {currentTab === "Home" && (
        <View style={styles.middleContainer}>
          <Image
            source={require("./assets/illustration.png")}
            style={styles.image}
          />
          <Text style={styles.content}>
            Empower transparency in e-commerce today by identifying and
            spotlighting dark patterns within website designs. Safeguard your
            online shopping experience, ensuring a trustworthy and user-friendly
            interaction.
          </Text>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload A Picture</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentTab === "Loading" && (
        <View style={styles.loadingContainer}>
          <Overlay
            isVisible={imageVisible}
            onBackdropPress={() => {
              setImageVisible(false);
              setResultImage("");
              setCurrentTab("Home");
            }}
            style={{ backgroundColor: "#f7f7f7" }}
          >
            <View
              style={{
                width: 0.8 * windowWidth,
                height: 0.78 * windowHeight,
              }}
            >
              <Text>Processed Image:&#13;&#10;</Text>
              <ReactNativeZoomableView maxZoom={50} minZoom={1}>
                <Image
                  style={{
                    width: 0.8 * windowWidth,
                    height: 0.78 * windowHeight,
                    resizeMode: "contain",
                    marginTop: 35,
                  }}
                  source={{ uri: `data:image/jpeg;base64,${resultImage}` }}
                />
              </ReactNativeZoomableView>
            </View>
          </Overlay>

          <AnimatedLoader
            source={require("./assets/loaders/loader.json")}
            visible={!imageVisible}
            overlayColor="transparent"
            animationStyle={styles.lottie}
            speed={0.8}
          >
            <Animated.Text
              style={[styles.loaderText, { transform: [{ scale }] }]}
            >
              {loaderText}
            </Animated.Text>
          </AnimatedLoader>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    margin: "auto",
    paddingTop: "15%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    color: "gray",
  },
  middleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "37%",
    width: "80%",
    marginHorizontal: "auto",
    marginLeft: "9%",
  },
  image: {
    width: 200,
    height: 200,
  },
  content: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
  },
  button: {
    backgroundColor: "#00E0FF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    fontSize: 20,
    marginTop: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    width: "100%",
  },
  lottie: {
    width: 300,
    height: 300,
    marginTop: -120,
    zIndex: -1,
  },
  loaderText: {
    fontSize: 22,
    textAlign: "center",
    marginTop: -50,
  },
  loadingContainer: {
    height: "90%",
    paddingTop: 100,
  },
};

export default YourComponent;
