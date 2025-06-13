import { useRef, useState, useCallback, useEffect } from "react";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useVideoPlayer } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from 'expo-router';
import { Button, Pressable, StyleSheet, Text, View, Image } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CameraVideoPreview from "../components/Video/CameraVideoPreview";

export default function VideoRecording() {
  // Permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

  // Camera ref
  const cameraRef = useRef(null);

  // Camera state
  const [uri, setUri] = useState(null);
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);

  // Camera UI
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Initialize the player
  const player = useVideoPlayer(uri ?? null, playerInstance => {
    playerInstance.loop = false;
    playerInstance.muted = false;
  });

  // Effect to automatically play the video when it's available
  useEffect(() => {
    if (player && uri) {
      player.play();
    }
  }, [player, uri]);

  useFocusEffect(
    useCallback(() => {
      const wasUriValidOnFocus = !!uri;
      setIsCameraActive(true);

      return () => {
        // Prevent the camera from being active when the screen is not focused
        setIsCameraActive(false);

        // Pause the video when the screen is not focused
        if (player && wasUriValidOnFocus) {
          try {
            player.pause();
          } catch (error) {
            console.warn(
              'Failed to pause video during focus cleanup:',
              error
            );
          }
        } else {
          console.log('Skipping pause in focus cleanup (player missing or URI was invalid).');
        }
      }
    }, [player, uri])
  );

  // Camera permissions are still loading
  if (!cameraPermission || !microphonePermission) {
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

  if (!mediaLibraryPermission || !mediaLibraryPermission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          We need your permission to save the video
        </Text>
        <Button onPress={requestMediaLibraryPermission} title="Grant permission" />
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
      }
    } catch (error) {
      console.error("Error recording video: ", error);
      setRecording(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const saveVideoToLibrary = async () => {
    if (uri) {
      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert('Video saved to gallery!');
      } catch (error) {
        console.error("Error saving video to library: ", error);
      }
    }
  }

  const renderVideoPreview = () => {
    return (
      <View style={[styles.container, styles.previewContainer]}>
        <CameraVideoPreview player={player} />

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={saveVideoToLibrary}>
            <Image source={require('../assets/images/save-icon.png')} style={styles.buttonImage} />
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: '#E55050' }]} onPress={() => setUri(null)}>
            <Image source={require('../assets/images/trash-white.png')} style={styles.buttonImage} />
          </Pressable>
        </View>
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
            mirror={true}
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
      {uri ? renderVideoPreview() : renderCamera()}
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
    width: "100%",
    paddingHorizontal: 20,
    gap: 20,
  },
  previewContainer: {
    gap: 24,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    top: 32,
    right: 15,
    gap: 10,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3984c6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonImage: {
    width: 28,
    height: 28,
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