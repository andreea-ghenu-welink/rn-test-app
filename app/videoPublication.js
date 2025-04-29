import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import VideoCover from '../components/Video/VideoCover';
import VideoPlayer from '../components/Video/VideoPlayer';

const VIDEO_PUBLICATION_URL = "https://lt.org/node/4930?_format=json";
const AUTHOR_URL = "https://lt.org/node/4928?_format=json";
const INSTITUTION_URL = "https://lt.org/node/4346?_format=json";
const COVER_IMAGE_URL = "https://lt.org/sites/default/files/video/covers/Escobar%20Karla_Coverphoto.jpg";

export default function VideoPublicationScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Data collections
  const [authorData, setAuthorData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [institutionData, setInstitutionData] = useState({});

  useEffect(() => {
    handleFetchData();
  }, []);

  async function handleFetchData() {
    setShowLoader(true);

    try {
      await fetchData(AUTHOR_URL, setAuthorData);
      await fetchData(VIDEO_PUBLICATION_URL, setVideoData);
      await fetchData(INSTITUTION_URL, setInstitutionData);

    } catch (error){
      console.error(error);

    } finally {
      setShowLoader(false);
      setIsLoading(false);
    }
  }

  async function fetchData(dataUrl, setterFn) {
    const data = await fetch(dataUrl).then(res => res.json());
    setterFn(data);
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
        showLoader && (
          <ActivityIndicator size="large" color="#3498db" />
        )) : 
        ( <View>
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
    gap: 16
  },
  dataIcon: {
    width: 40,
    height: 40,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
  }
});