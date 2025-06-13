import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export default function VideoCover({ coverImageUrl, author, onVideoPlay }) {
  return (
    <View>
      <Image source={{uri: coverImageUrl}} style={styles.coverImage} />
      <Text style={styles.videoAuthor}>{author.title?.[0]?.value}</Text>
      <Pressable style={styles.playButton} onPress={onVideoPlay}>
        <Image source={require('../../assets/images/play-icon.png')} style={styles.playIcon}/>
        <Text style={styles.playButtonText}>Watch Now</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: 360,
    height: 215,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
  },
  videoAuthor: {
    position: 'absolute',
    top: 24,
    left: 24,
    fontSize: 18,
    color: '#fff',
  },
  playButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c2c229',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
  playIcon: {
    width: 18,
    height: 18,
  },
});