import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import AnimatedLoader from 'react-native-animated-loader';

const YourComponent = () => {
  const [image, setImage] = useState(null);
  const [currentTab, setCurrentTab] = useState("Home");
  const [visible, setVisible] = useState(true);
  const [loaderText, setLoaderText] = useState("Connecting to Servers");

  const scale = useRef(new Animated.Value(1)).current;

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
    });

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setCurrentTab("Loading");
      sendImageToBackend(result.assets[0].uri);
    }
  };

  const sendImageToBackend = async (uri) => {
    let loaderTexts = [
      "Connecting to Servers",
      "Extracing Text Content",
      "Analyzing Text Content",
      "Highlighting Dark Patterns",
      "Rendering Results",
    ]

    let currentText = 0;
    const loaderInterval = setInterval(() => {
      setLoaderText(loaderTexts[currentText]);
      currentText += 1;

      if(currentText == loaderTexts.length){
        currentText = 2;
      }
    }, 6000)

    // Call backend API here
  };

  return (
    <>
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
        {
            currentTab === "Home" && (
                <View style={styles.middleContainer}>
                  <Image
                    source={require("./assets/illustration.png")}
                    style={styles.image}
                  />
                  <Text style={styles.content}>Empower transparency in e-commerce today by identifying and spotlighting dark patterns within website designs. Safeguard your online shopping experience, ensuring a trustworthy and user-friendly interaction.</Text>
                  <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Upload A Picture</Text>
                  </TouchableOpacity>
                </View>
            )
        }

        {currentTab === "Loading" && (
          <View style={styles.loadingContainer}>
            <AnimatedLoader
              source={require("./assets/loaders/loader.json")}
              visible={visible}
              overlayColor="transparent"
              animationStyle={styles.lottie}
              speed={0.8}

            >
              <Animated.Text style={[styles.loaderText, { transform: [{ scale }] }]}>
                {loaderText}
              </Animated.Text>
            </AnimatedLoader>
          </View>
        )}
        </View>
    </>
);
};

const styles = {
  container: {
    flex: 1,
    margin: "auto",
    paddingTop:"15%",
  },
  header: {
    display:"flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex:100
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
    display:"flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "37%",
    width:"80%",
    marginHorizontal: "auto",
    marginLeft: "9%"
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
    paddingHorizontal: 100,
    paddingVertical: 10,
    fontSize: 20,
    marginTop: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  lottie: {
    width: 300,
    height: 300,
    marginTop: -120,
    zIndex: -1
  },
  loaderText: {
    fontSize: 22,
    textAlign: "center",
    marginTop: -50,
  },
  loadingContainer: {
    height: "90%",
    paddingTop: 100
  }
};

export default YourComponent;
