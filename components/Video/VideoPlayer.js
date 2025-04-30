import { useState, useCallback, forwardRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Video, ResizeMode, VideoFullscreenUpdate } from 'expo-av';

const VideoPlayer = forwardRef(({ videoData }, ref) => {
  // Add separate loading state
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});

  // State to track full screen mode
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Extract the URI safely
  const videoUri = videoData?.field_video_url?.[0]?.uri;

  // Memoize the fullscreen update handler for performance optimizations
  const handleFullscreenUpdate = useCallback(({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case VideoFullscreenUpdate.PLAYER_DID_PRESENT:
        setIsFullScreen(true); // Set true when fullscreen starts
        break;
      case VideoFullscreenUpdate.PLAYER_DID_DISMISS:
        setIsFullScreen(false); // Set false when fullscreen ends
        break;
    }
  }, []); // No dependencies, so useCallback is efficient here

  // Handle playback status updates
  const handlePlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);
    
    // Set loading to false once the video is loaded
    if (playbackStatus.isLoaded && isLoading) {
      setIsLoading(false);
    }
  };

  // Handle cases where the URI might be missing
  if (!videoUri) {
    // Optionally return null, an error message, or a placeholder
    console.error("Video URI is missing from videoData");

    return (
      <View style={[styles.videoContainer, styles.centerContent]}>
        <Text style={{ color: '#333', fontSize: 16, fontWeight: 600 }}>
          Video not available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.videoContainer}>
      {/* Video component is always rendered to initiate loading */}
      <Video
        style={styles.video}
        ref={ref}
        source={{
          uri: videoUri,
        }}
        useNativeControls
        resizeMode={isFullScreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
        // Start paused; playback initiated via cover click or native controls
        shouldPlay={false}
        onFullscreenUpdate={handleFullscreenUpdate}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => {
          console.error("Video Error:", error);
          setIsLoading(false);
        }}
        onLoadStart={() => setIsLoading(true)}
      />

      {/* Show ActivityIndicator overlay only if video is loading */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
    </View>
  )
});

export default VideoPlayer;

const styles = StyleSheet.create({
  videoContainer: {
    width: 360,
    height: 215,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    // Absolute position to cover the Video component
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Center the ActivityIndicator within the overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Helper style for centering content (e.g., error message)
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
