import { useState } from 'react';
import { useEvent } from 'expo';
import { VideoView } from 'expo-video';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function CameraVideoPreview({ player }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playerStatus = useEvent(player, 'statusChange', {
    status: player?.status,
    error: undefined,
  });

  const isLoading = playerStatus.status === 'loading';
  
  if (!player) {
    return (
      <View style={[styles.videoContainer, styles.centerContent]}>
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
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  videoContainer: {
    width: 300,
    aspectRatio: 9/16,
    overflow: 'hidden',
    backgroundColor: '#000',
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