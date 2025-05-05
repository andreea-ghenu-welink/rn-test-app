import { View, Text, Image, Modal, Pressable, StyleSheet } from 'react-native';

export default function SelectImageModal({ 
  isVisible, 
  onTakePhoto, 
  onPickImage, 
  onCancel 
}) {
  return (
    <Modal visible={isVisible} animationType='slide'>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Choose an option</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onPickImage}>
            <Image source={require('../../assets/images/gallery-icon.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Gallery</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onTakePhoto}>
            <Image source={require('../../assets/images/camera-white.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Camera</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: 200,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3984c6',
  },
  buttonIcon: {
    width: 28,
    height: 28,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#A3A5A5',
  },
});