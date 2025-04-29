import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Image, Pressable } from 'react-native';

const VIDEO_PUBLICATION_URL = "https://lt.org/node/4930?_format=json";
const AUTHOR_URL = "https://lt.org/node/4928?_format=json";
const COVER_IMAGE_URL = "https://lt.org/sites/default/files/video/covers/Escobar%20Karla_Coverphoto.jpg";

export default function ResearcherVideoScreen() {  
  const [isLoading, setIsLoading] = useState(true);
  const [authorData, setAuthorData] = useState({});
  const [videoTitle, setVideoTitle] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const router = useRouter();

  const placeholder = 
    <Text style={styles.title}>
      Click the{' '}
      <Text style={styles.highlightedText}>Fetch</Text>
      {' '}button below to discover and display researcher video details
    </Text>

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
    setAuthorData([]);
    setIsLoading(true);
    setShowLoader(false);
    setVideoTitle('');
  }

  function handleCardPress() {
    router.push('/videoPublication');
  }

  return (
    <View style={styles.container}>
      {
        isLoading ? (
          showLoader ? (
            <ActivityIndicator size="large" color="#3498db" />
          ) : (
            placeholder
          )
        ) : (
          <Pressable style={styles.videoCard} onPress={handleCardPress}>
            <Image 
              source={{uri: COVER_IMAGE_URL}} 
              style={styles.coverImage}
              onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.videoCardContent}>
              <Text style={styles.videoTitle}>
              {videoTitle}
            </Text>
            <Text style={styles.videoAuthor}>
              {authorData.title[0].value}
            </Text>
            </View>
          </Pressable>
        )
      }
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleFetchData}>
          <Text style={styles.buttonText}>Fetch</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.clearButton]} onPress={handleClearData}>
          <Text style={styles.buttonText}>Clear Data</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  highlightedText: {
    fontWeight: 'bold',
    color: '#3498db',
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70,
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
    width: 160,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: '#A3A5A5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoCard: {
    width: 320,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 192,
    resizeMode: 'cover',
  },
  videoCardContent: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  videoAuthor: {
    fontSize: 16,
    color: '#666',
  },
});