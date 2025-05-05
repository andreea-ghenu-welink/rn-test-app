import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import VideoCover from '../components/Video/VideoCover';
import VideoPlayer from '../components/Video/VideoPlayer';

// --- Constants ---
const VIDEO_PUBLICATION_URL = "https://lt.org/node/4930?_format=json";
const AUTHOR_URL = "https://lt.org/node/4928?_format=json";
const INSTITUTION_URL = "https://lt.org/node/4346?_format=json";
const COVER_IMAGE_URL = "https://lt.org/sites/default/files/video/covers/Escobar%20Karla_Coverphoto.jpg";

export default function VideoPublicationScreen() {
  // --- State ---
  const [isLoading, setIsLoading] = useState(true); // Loading for initial data fetch
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [authorData, setAuthorData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [institutionData, setInstitutionData] = useState({});

  // --- Derived State ---
  const videoUri = videoData?.field_video_url?.[0]?.uri;

  // --- Hooks ---

  // Initialize video player. Called on every render.
  // Pass null initially, then the real URI after fetch.
  const player = useVideoPlayer(videoUri ?? null, playerInstance => {
    // This callback runs AFTER the player instance is created/recreated.
    playerInstance.loop = false;
    playerInstance.muted = false;
  });

  // Fetch data only once when the component mounts.
  useEffect(() => {
    handleFetchData();
  }, []); // Empty dependency array ensures this runs only once.

  // Effect to automatically play the video when it becomes visible.
  useEffect(() => {
    // Play only if:
    // 1. We intend to show the player (showVideoPlayer is true)
    // 2. The player instance exists
    // 3. We actually have a valid videoUri
    if (showVideoPlayer && player && videoUri) {
      player.play();
    }
  }, [showVideoPlayer, player, videoUri]); // Re-run if visibility, player instance, or URI changes.

  // Effect to pause video when the screen loses focus (blurs) or unmounts.
  useFocusEffect(
    useCallback(() => {
      // This code runs when the screen gains focus.
      // We capture the state of videoUri *at the time this effect runs*.
      const wasUriValidOnFocus = !!videoUri;

      // Return the cleanup function. This runs when the screen loses focus or unmounts.
      return () => {
        // Only attempt to pause if the player instance exists AND
        // the URI was valid when this *specific* effect instance was set up.
        // This prevents the cleanup from the initial null-URI state from causing issues.
        if (player && wasUriValidOnFocus) {
          try {
            player.pause();
          } catch (error) {
            console.warn(
              'Failed to pause video during focus cleanup (likely race condition):',
              error
            );
          }
        } else {
          console.log('Skipping pause in focus cleanup (player missing or URI was invalid).');
        }
      };
    }, [player, videoUri]) // *** IMPORTANT: Depend on both player and videoUri ***
    // This ensures the effect re-runs and captures the new URI state
    // when the videoUri becomes available after the fetch.
  );

  // --- Async Functions ---
  async function handleFetchData() {
    setIsLoading(true); // Ensure loading state is active during fetch
    try {
      await Promise.all([
        fetchData(AUTHOR_URL, setAuthorData),
        fetchData(VIDEO_PUBLICATION_URL, setVideoData),
        fetchData(INSTITUTION_URL, setInstitutionData)
      ]);
    } catch (error){
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false); // Stop loading indicator
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
      throw error; // Allow Promise.all to catch it
    }
  }

  // --- Event Handlers ---
  function handlePlayVideo() {
    // Only transition to showing the player if the URI is ready.
    if (videoUri) {
      setShowVideoPlayer(true);
    } else {
      console.warn('Tried to play video, but URI is not available yet.');
    }
  }

  // --- Helper Functions ---
  function stripHtmlTags(html) {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  // --- Render Logic ---

  // Show loading indicator while fetching initial data.
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Render content once data is loaded.
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Video Section */}
        <View style={{marginBottom: 32}}>
          {/* Conditionally render Player only when intended AND URI is ready */}
          { showVideoPlayer && videoUri ?
            <VideoPlayer
              videoSource={videoUri}
              player={player}
            /> :
            <VideoCover
              coverImageUrl={COVER_IMAGE_URL} // Provide fallback if needed
              author={authorData}
              onVideoPlay={handlePlayVideo}
            />
          }
          {/* Video Info - Render only if data is available */}
          { videoData.title && (
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{videoData.title?.[0]?.value}</Text>
              <Text style={styles.text}>{videoData.field_abstract?.[0]?.value}</Text>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontWeight: 600 }]}>DOI: </Text>
                <Text style={styles.text}>{videoData.field_doi?.[0]?.value}</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Researcher Section - Render only if data is available */}
        {authorData.field_bio && (
          <View style={styles.dataContainer}>
            <View style={styles.dataInfo}>
              <Image source={require('../assets/images/student-icon.png')} style={styles.dataIcon} />
              <Text style={styles.dataTitle}>Researcher</Text>
            </View>
            <Text style={styles.text}>{authorData.field_bio?.[0]?.value}</Text>
          </View>
        )}

        {/* Institution Section - Render only if data is available */}
        {institutionData.title && (
          <View style={styles.dataContainer}>
            <View style={styles.dataInfo}>
              <Image source={require('../assets/images/building-icon.png')} style={styles.dataIcon} />
              <Text style={styles.dataTitle}>Institution</Text>
            </View>
            <Text style={[styles.text, { fontWeight: 600 }]}>{institutionData.title?.[0]?.value}</Text>
            <Text style={styles.text}>{stripHtmlTags(institutionData.field_description?.[0]?.value)}</Text>
          </View>
        )}

        {/* Credit Section */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Credit</Text>
          <View>
            <Text style={[styles.text, { marginBottom: 8 }]}>© and Latest Thinking</Text>
            <Text style={styles.text}>This work is licensed under CC-BY 4.0</Text>
          </View>
        </View>
      </ScrollView>
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