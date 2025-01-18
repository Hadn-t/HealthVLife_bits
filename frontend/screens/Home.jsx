import React, { useLayoutEffect, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Linking, Alert } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar, faUser, faHeart, faUserMd, faStethoscope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from '../firebaseConfig'; 

const HomeScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('Client'); 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
  
    const fetchUserData = async () => {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", auth.currentUser.uid);  
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
         
          if (userData.firstname) {
            setUserName(` ${userData.firstname}`);  
          } else {
            setUserName('Client');  
          }
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

   
    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

 
  const handleSOSNavigate = () => {
    navigation.navigate('Nearby Hospitals', { screen: 'NearbyHospitalsTab' });
  };

  const handleSOSCall = () => {
    const phoneNumber = 'tel:112';

    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber); 
        } else {
          Alert.alert('Error', 'Unable to make a phone call at this time.');
        }
      })
      .catch((error) => {
        console.error('Error opening URL:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      });
  };

  const handleProfileNavigate = () => {
    navigation.navigate('Profile', { role: 'client' });
  };

  const handleAppointmentNavigate = () => {
    navigation.navigate('Appointments');
  };

  const QuickActionCard = ({ icon, title, onPress, color = '#007BFF' }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FontAwesomeIcon icon={icon} size={32} color="#fff" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.headerText}>{userName}</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.cardContainer}>
            <QuickActionCard
              icon={faCalendar}
              title="Appointments"
              onPress={handleAppointmentNavigate}
              color="#4A90E2"
            />
            <QuickActionCard
              icon={faUser}
              title="My Profile"
              onPress={handleProfileNavigate}
              color="#50C878"
            />
            <QuickActionCard
              icon={faHeart}
              title="Health Stats"
              onPress={() => {}}
              color="#FF7F50"
            />
            <QuickActionCard
              icon={faUserMd}
              title="Find Doctor"
              onPress={() => {}}
              color="#9B59B6"
            />
            <QuickActionCard
              icon={faStethoscope}
              title="Health Tips"
              onPress={() => {}}
              color="#E67E22"
            />
          </View>
        </View>

        {/* Health Statistics Summary */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>120/80</Text>
              <Text style={styles.statLabel}>Blood Pressure</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>72</Text>
              <Text style={styles.statLabel}>Heart Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Oxygen</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Your Health, Our Priority</Text>
        </View>
      </ScrollView>

      {/* SOS Button */}
      <TouchableOpacity
        style={[styles.sosButton, { marginTop: 10 }]}
        onPress={handleSOSCall}
        activeOpacity={0.8}
      >
        <View style={styles.sosContent}>
          <FontAwesomeIcon icon={faPhone} size={20} color="#fff" />
          <Text style={styles.sosButtonText}>Call Ambulance</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Same styles as before...
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  welcomeText: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  mainContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    paddingHorizontal: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007BFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  sosButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
