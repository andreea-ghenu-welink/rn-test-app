import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import VideoCover from '../components/Video/VideoCover';
import VideoPlayer from '../components/Video/VideoPlayer';

const VIDEO_PUBLICATION_URL = "https://lt.org/node/4930?_format=json";
const AUTHOR_URL = "https://lt.org/node/4928?_format=json";
const INSTITUTION_URL = "https://lt.org/node/4346?_format=json";
const COVER_IMAGE_URL = "https://lt.org/sites/default/files/video/covers/Escobar%20Karla_Coverphoto.jpg";

export default function VideoPublicationScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Data collections
  const [authorData, setAuthorData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [institutionData, setInstitutionData] = useState({});

  // Video player reference
  const videoRef = useRef(null);

  useEffect(() => {
    handleFetchData();
  }, []);

  // Effect to handle initial play when player becomes visible
  useEffect(() => {
    // Only try to play if the player should be visible AND the ref is attached
    if (showVideoPlayer && videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [showVideoPlayer]); // Dependency: run when showVideoPlayer changes

  // Effect to pause video when the screen loses focus
  useFocusEffect(
    useCallback(() => {
     // This runs when the screen comes into focus.
      // We don't need to do anything here for playback control.

      // Return the cleanup function to run when the screen loses focus.
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      }
    }, []) // Empty dependency array: runs on mount/unmount and focus/blur
  )

  async function handleFetchData() {
    try {
      await Promise.all([
        fetchData(AUTHOR_URL, setAuthorData),
        fetchData(VIDEO_PUBLICATION_URL, setVideoData),
        fetchData(INSTITUTION_URL, setInstitutionData)
      ]);

    } catch (error){
      console.error('Failed to fetch data:', error);

    } finally {
      setIsLoading(false)
    }
  }

  async function fetchData(dataUrl, setterFn) {
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setterFn(data);
    } catch (error) {
      console.error(`Error fetching ${dataUrl}:`, error);
      throw error;
    }
  }
  
  function handlePlayVideo() {
    setShowVideoPlayer(true);
  }

  // Function to strip HTML tags from text
  function stripHtmlTags(html) {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  return (
    <View style={styles.container}>
      { isLoading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : 
        ( 
          <View>
            <ScrollView>
              {/* Video Publication */}
              <View style={{marginBottom: 32}}>
                { !showVideoPlayer ? 
                  <VideoCover 
                    coverImageUrl={COVER_IMAGE_URL}
                    author={authorData}
                    onVideoPlay={handlePlayVideo}
                  /> : 
                  <VideoPlayer 
                    videoData={videoData}
                    ref={videoRef}
                  />
                }
                {/* Video Info */}
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{videoData.title?.[0]?.value}</Text>
                  <Text style={styles.text}>{videoData.field_abstract?.[0]?.value}</Text>
                </View>
                <Text style={styles.text}>
                  <Text style={[styles.text, { fontWeight: 600 }]}>DOI: </Text>
                  <Text style={styles.text}>{videoData.field_doi?.[0]?.value}</Text>
                </Text>
              </View> 

              {/* Researcher */}
              <View style={styles.dataContainer}>
                <View style={styles.dataInfo}>
                  <Image source={require('../assets/images/student-icon.png')} style={styles.dataIcon} />
                  <Text style={styles.dataTitle}>Researcher</Text>
                </View>
                <Text style={styles.text}>{authorData.field_bio?.[0]?.value}</Text>
              </View>

              {/* Institution */}
              <View style={styles.dataContainer}>
                <View style={styles.dataInfo}>
                  <Image source={require('../assets/images/building-icon.png')} style={styles.dataIcon} />
                  <Text style={styles.dataTitle}>Institution</Text>
                </View>
                <Text style={[styles.text, { fontWeight: 600 }]}>{institutionData.title?.[0]?.value}</Text>
                <Text style={styles.text}>{stripHtmlTags(institutionData.field_description?.[0]?.value)}</Text>
              </View> 

              {/* Credit */}
              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Credit</Text>
                <View>
                  <Text style={[styles.text, { marginBottom: 8 }]}>© and Latest Thinking</Text>
                  <Text style={styles.text}>This work is licensed under CC-BY 4.0</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  videoInfo: {
    gap: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  dataContainer: {
    gap: 20,
    paddingVertical: 32,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  dataIcon: {
    width: 36,
    height: 36,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
  }
});