import { useState } from 'react';
import { Link } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Image, Pressable } from 'react-native';

const VIDEO_PUBLICATION_URL = "https://lt.org/node/4930?_format=json";
const AUTHOR_URL = "https://lt.org/node/4928?_format=json";
const COVER_IMAGE_URL = "https://lt.org/sites/default/files/video/covers/Escobar%20Karla_Coverphoto.jpg";

export default function ResearcherVideoScreen() {  
  const [isLoading, setIsLoading] = useState(true);
  const [authorData, setAuthorData] = useState({});
  const [videoTitle, setVideoTitle] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  async function handleFetchData() {
    setShowLoader(true);

    try {
      await fetchAuthorData();
      await fetchVideoTitle();
    } catch (error){
      console.error(error);
    } finally {
      setShowLoader(false);
      setIsLoading(false);
    }
  }

  async function fetchAuthorData() {
    const data = await fetch(AUTHOR_URL).then(res => res.json());
    setAuthorData(data);
  }

  async function fetchVideoTitle() {
    const data = await fetch(VIDEO_PUBLICATION_URL).then(res => res.json());
    setVideoTitle(data.title[0].value);
  }

  function handleClearData() {
    setAuthorData({});
    setIsLoading(true);
    setShowLoader(false);
    setVideoTitle('');
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        showLoader ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loaderText}>Loading researcher data...</Text>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Image source={require('../assets/images/article-icon.png')} style={styles.placeholderImage} />
            <Text style={styles.title}>
              Click the button below to discover and display researcher video details
            </Text>
          </View>
        )
      ) : (
          <View style={styles.videoCard}>
            <Link href="/videoPublication">
              <Image 
                source={{uri: COVER_IMAGE_URL}} 
                style={styles.coverImage}
                onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
              />
            </Link>
            <View style={styles.videoCardContent}>
              <Text style={styles.videoAuthor}>
                {authorData.title && authorData.title[0] ? authorData.title[0].value : 'Author information'}
              </Text>
              <Text style={styles.videoTitle}>
                {videoTitle}
              </Text>
              <Link href="/videoPublication" asChild>
                <Pressable style={styles.playButton}>
                  <Image source={require('../assets/images/play-icon.png')} style={styles.playIcon}/>
                  <Text style={styles.playButtonText}>Watch Now</Text>
                </Pressable>
              </Link>
            </View>
          </View>
      )}
      
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <Pressable 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleFetchData}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Fetch Data' : 'Fetch New'}</Text>
          </Pressable>
        ) : (
          <Pressable 
            style={[styles.button, styles.clearButton]} 
            onPress={handleClearData}
          >
            <Text style={styles.buttonText}>Clear Data</Text>
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
    justifyContent: 'center',
    marginTop: -100,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    lineHeight: 24,
  },
  placeholderContainer: {
    alignItems: 'center',
    gap: 40,
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 140,
  },
  playButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    width: 150,
    backgroundColor: '#c2c229',
    borderRadius: 3,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
  playIcon: {
    width: 18,
    height: 18,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  clearButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoCard: {
    width: '98%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  videoCardContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  videoAuthor: {
    fontSize: 14,
    color: '#666',
  },
});