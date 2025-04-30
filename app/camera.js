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

  let imagePreview = 
    <View style={styles.imagePlaceholderContainer}>
      <Image source={require('../assets/images/image-placeholder.png')} style={styles.imagePlaceholder} />
      <Text style={styles.noImageText}>Tap the camera button to take a photo</Text>
    </View>
    
  if (pickedImage) {
    imagePreview = <Image source={{uri: pickedImage}} style={styles.image} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.cameraButton]} onPress={takeImageHandler}>
          <Image source={require('../assets/images/camera-white.png')} style={{width: 40, height: 40}} />
        </Pressable>

        {pickedImage && (
          <Pressable style={[styles.button, styles.clearButton]} onPress={clearImageHandler}>
            <Image source={require('../assets/images/trash-white.png')} style={{width: 40, height: 40}} />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    marginHorizontal: 'auto',
    padding: 18,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButton: {
    backgroundColor: '#A3A5A5',
  },
  cameraButton: {
    backgroundColor: '#3498db',
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
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePlaceholderContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    marginBottom: 20,
    marginHorizontal: 'auto',
  },
  noImageText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: '#ccc',
    fontWeight: 600,
    textAlign: 'center',
  },
});