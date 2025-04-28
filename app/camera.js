import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';

export default function CameraScreen() {
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
  const [pickedImage, setPickedImage] = useState();

  async function verifyPermissions() {
    // if the permission is not determined, request permission
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    // if the permission is denied, return false
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert('Insufficient Permissions!', 'You need to grant permission to use the camera');
      return false;
    }

    // if the permission is granted, return true
    return true;
  }

  async function takeImageHandler() {
    const hasPermissions = await verifyPermissions();

    if (!hasPermissions) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true, // allows user to edit the image before saving
      quality: 0.5, // quality of the image
    });

    setPickedImage(image.assets[0].uri);
  }

  function clearImageHandler() {
    setPickedImage(null);
  }

  let imagePreview = <Text style={styles.noImageText}>No image picked yet</Text>;

  if (pickedImage) {
    imagePreview = <Image source={{uri: pickedImage}} style={styles.image} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={takeImageHandler}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </Pressable>

        {pickedImage && (
          <Pressable style={[styles.button, styles.clearButton]} onPress={clearImageHandler}>
            <Text style={styles.buttonText}>Clear Image</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3498db',
    marginHorizontal: 'auto',
    marginTop: 20,
    width: 170,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: '#A3A5A5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreview: {
    width: "100%",
    height: 400,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});