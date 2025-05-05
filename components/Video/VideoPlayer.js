import { useState } from 'react';
// Import useEvent hook from expo
import { useEvent } from 'expo';
// Import VideoView and the status enum
import { VideoView } from 'expo-video';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

function VideoPlayer({ player }) {
  // --- State for UI unrelated to player status ---
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- Use useEvent to get the latest player status ---
  // It returns an object with the latest event payload ({ status, error }).
  const playerStatus = useEvent(player, 'statusChange', {
    status: player?.status, // Initial status
    error: undefined,       // Initial error state
  });

  // --- Derive isLoading directly from the status provided by useEvent ---
  // The component will re-render automatically when latestEvent.status changes.
  const isLoading = playerStatus.status === 'loading';

  // --- Render Logic ---

  // Handle the case where the player prop might not be ready yet
  // (although useEvent might handle null player gracefully, this is safer)
  if (!player) {
     return (
       <View style={[styles.videoContainer, styles.centerContent]}>
         {/* Show a placeholder or minimal loader */}
         <ActivityIndicator size="large" color="#cccccc" />
       </View>
     );
  }

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls
        allowsFullscreen
        contentFit={isFullScreen ? 'contain' : 'cover'}
        onFullscreenEnter={() => setIsFullScreen(true)}
        onFullscreenExit={() => setIsFullScreen(false)}
      />

      {/* Show ActivityIndicator overlay based on the derived isLoading state */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
    </View>
  );
}

export default VideoPlayer;

// --- Styles ---
const styles = StyleSheet.create({
  videoContainer: {
    width: 360,
    height: 215,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000', // Keep background for visibility
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});