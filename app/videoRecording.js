import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function VideoRecording() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(true);

  // Prevent the camera from being active when the screen is not focused
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);

      return () => {
        setIsCameraActive(false);
      }
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    setUri(photo?.uri);
  };

  const recordVideo = async () => {
    console.log(recording);
    if (recording) {
      setRecording(false);
      cameraRef.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await cameraRef.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = () => {
    return (
      <View style={[styles.container, styles.previewContainer]}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={styles.previewImage}
        />
        <Pressable style={styles.button} onPress={() => setUri(null)}>
          <Text style={styles.buttonText}>Take another picture</Text>
        </Pressable>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.camera}>
        {isCameraActive && (
          <CameraView
          style={styles.camera}
          ref={cameraRef}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
        )}
        {/* Overlay UI components */}
        <View style={styles.cameraBorderContainer}>
          <View style={styles.cameraBorder} />
        </View>
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <Feather name="video" size={32} color="white" />
            ) : (
              <AntDesign name="picture" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    gap: 30,
    borderRadius: 30,
    overflow: "hidden",
  },
  previewImage: {
    borderRadius: 30,
    width: 450,
    aspectRatio: 1,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  button: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3984c6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  cameraBorderContainer: {
    position: "absolute",
    width: '100%',
    top: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBorder: {
    width: 300,
    height: 400,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    borderStyle: "dashed",
  },
});