import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import SelectImageModal from '../components/Modal/SelectImageModal';
import { 
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions, 
  useMediaLibraryPermissions, 
  PermissionStatus 
} from 'expo-image-picker';

export default function CameraScreen() {
  // States for camera and gallery permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = useMediaLibraryPermissions();

  // State for selected image
  const [selectedImage, setSelectedImage] = useState();

  // State for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function verifyPermissions(permission, requestPermissionFunction) {
    // if the permission is not determined, request permission
    if (permission.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermissionFunction();
      return permissionResponse.granted;
    }

    // if the permission is denied, return false
    if (permission.status === PermissionStatus.DENIED) {
      if (permission === cameraPermission) {
        Alert.alert('Insufficient Permissions!', 'You need to grant permission to use the camera');
      } else {
        Alert.alert('Insufficient Permissions!', 'You need to grant permission to use the gallery');
      }
      return false;
    }

    // if the permission is granted, return true
    return true;
  }

  async function takeCameraImageHandler() {
    const hasPermissions = await verifyPermissions(cameraPermission, requestCameraPermission);

    if (!hasPermissions) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled) {
      setSelectedImage(image.assets[0].uri);
      setIsModalVisible(false);
    }
  }

  async function pickGalleryImageHandler() {
    const hasPermissions = await verifyPermissions(galleryPermission, requestGalleryPermission);

    if (!hasPermissions) {
      return;
    }

    const image = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled) {
      setSelectedImage(image.assets[0].uri);
      setIsModalVisible(false);
    }
  }

  function clearImageHandler() {
    setSelectedImage(null);
  }

  function cancelModalHandler() {
    setIsModalVisible(false);
  }

  let imagePreview = 
    <View style={styles.imagePlaceholderContainer}>
      <Image source={require('../assets/images/image-placeholder.png')} style={styles.imagePlaceholder} />
      <Text style={styles.noImageText}>Tap the button below to capture or select an image</Text>
    </View>
    
  if (selectedImage) {
    imagePreview = <Image source={{uri: selectedImage}} style={styles.image} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.imageButton]} onPress={() => setIsModalVisible(true)}>
          <Image source={require('../assets/images/image-picker.png')} style={{width: 40, height: 40}} />
        </Pressable>

        {selectedImage && (
          <Pressable style={[styles.button, styles.clearButton]} onPress={clearImageHandler}>
            <Image source={require('../assets/images/trash-white.png')} style={{width: 40, height: 40}} />
          </Pressable>
        )}
      </View>

      <SelectImageModal 
        isVisible={isModalVisible} 
        onTakePhoto={takeCameraImageHandler}
        onPickImage={pickGalleryImageHandler}
        onCancel={cancelModalHandler} 
      />
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
  imageButton: {
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