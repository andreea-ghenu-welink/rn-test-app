import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Here we define the tabs, which screen will be displayed and the icons for each tab
export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tab Bar Styling
        tabBarActiveTintColor: '#3984c6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,

        // Header Styling
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff', // Header background color
          height: 110, // Header height
          elevation: 4, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        headerTintColor: '#000', // Back button and title color
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerTitleAlign: 'left', // 'left' (default for Android), 'center' (default for iOS)
        // Adding left/right padding to header title
        headerTitleContainerStyle: {
          paddingHorizontal: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={32} color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="researcherVideo"
        options={{
          title: 'Researcher Video',
          tabBarIcon: ({ color }) => <Ionicons name="videocam" size={32} color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="videoPublication"
        options={{
          title: 'Video Publication',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={32} color={color} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60, // Increase tab bar height
    paddingBottom: 5, // Add padding at the bottom
    paddingTop: 5, // Add padding at the top
    backgroundColor: '#FFFFFF',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarItem: {
    padding: 4, // Adds padding around each tab item
  },
});