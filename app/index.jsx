import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <ImageBackground 
      source={require('../assets/images/app-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to our app!</Text>
        <Text style={styles.text}>
          Discover a world of curated videos at your fingertips.
          Browse featured content, explore detailed information, and enjoy a seamless viewing experience
        </Text>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});