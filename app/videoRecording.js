import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useRef, useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function VideoRecording() {
  // Permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  // Camera ref
  const cameraRef = useRef(null);

  // Camera state
  const [uri, setUri] = useState(null);
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);

  // Camera UI
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

  if (!cameraPermission || !microphonePermission) {
    // Camera permissions are still loading
    return null;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant permission" />
      </View>
    );
  }

  if (!microphonePermission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          We need your permission to use the microphone
        </Text>
        <Button onPress={requestMicrophonePermission} title="Grant permission" />
      </View>
    );
  }

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      cameraRef.current?.stopRecording();
      return;
    }

    setRecording(true);

    try {
      const video =  await cameraRef.current?.recordAsync();
      if (video) {
        setUri(video?.uri);
        console.log({ video });
      }
    } catch (error) {
      console.error("Error recording video: ", error);
      setRecording(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = () => {
    return (
      <View style={[styles.container, styles.previewContainer]}>
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
            mode={'video'}
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
          <Pressable onPress={recordVideo}>
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
                      backgroundColor: recording ? "red" : "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable style={styles.toggleFacing} onPress={toggleFacing}>
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
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
    justifyContent: "center",
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
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  toggleFacing: {
    position: "absolute",
    right: 40,
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