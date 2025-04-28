import { View, Text, StyleSheet, Image } from 'react-native';

export default function ResearcherVideoScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.text}>Name: John Doe</Text>
      <Text style={styles.text}>Email: john@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});