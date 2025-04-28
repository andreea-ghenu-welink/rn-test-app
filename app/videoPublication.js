import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function VideoPublicationScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>
          This is a simple demo app built with React Native and Expo Router,
          demonstrating how to implement navigation between multiple screens.
        </Text>
        
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.listItem}>• File-based routing</Text>
        <Text style={styles.listItem}>• Tab navigation</Text>
        <Text style={styles.listItem}>• Multiple screens</Text>
        <Text style={styles.listItem}>• Clean, modern UI</Text>
        
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.text}>
          For support or inquiries, please contact support@example.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginLeft: 10,
  },
});