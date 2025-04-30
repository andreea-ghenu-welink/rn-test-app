import { useState, useCallback } from 'react';
import { useEventListener } from 'expo';
import { VideoView } from 'expo-video';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

function VideoPlayer({ videoSource, player }) {
  const [playerStatus, setPlayerStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Listen to status change event and update loading state
	useEventListener(player, 'statusChange', ({ status }) => {
	  setPlayerStatus(status);
    setIsLoading(status === 'loading');
	});

  // Handle cases where the URI might be missing
  if (!videoSource) {
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
      <VideoView
	      style={styles.video}
	      player={player}
	      nativeControls
        allowsFullscreen
        contentFit={isFullScreen ? 'contain' : 'cover'}
        onFullscreenEnter={() => setIsFullScreen(true)}
        onFullscreenExit={() => setIsFullScreen(false)}
	    />

      {/* Show ActivityIndicator overlay only if video is loading */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
    </View>
  )
}

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
