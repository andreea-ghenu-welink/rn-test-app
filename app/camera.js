import { View, Text, Pressable, StyleSheet } from 'react-native';
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';

export default function CameraScreen() {
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

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
  }

  return (
    <View style={styles.container}>
      <View>
      </View>
      <Pressable style={styles.button} onPress={takeImageHandler}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    backgroundColor: '#3498db',
    width: 170,
    marginHorizontal: 'auto',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});