
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Logo from '../Components/logo';

const WorkoutDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params as { workout: any };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStartWorkout = () => {
    // Navigate to workout session screen
    (navigation as any).navigate('WorkoutSession', { workout });
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#DD00FF';
      case 'Intermediate':
        return '#7650FF';
      case 'Advanced':
        return '#FF6B6B';
      default:
        return '#DD00FF';
    }
  };

  return (
    <LinearGradient
      colors={['#F5F5F5', '#E5E5E5']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Logo primaryColor="#DD00FF" secondaryColor="#7650FF" scale={0.7} />
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Workout Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: workout.image }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <View style={styles.difficultyBadge}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(workout.difficulty) }]}>
                  {workout.difficulty}
                </Text>
              </View>
            </View>
          </View>

          {/* Workout Info */}
          <View style={styles.content}>
            <Text style={styles.title}>{workout.title}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.infoText}>{workout.duration}</Text>
              </View>
              {workout.sets && workout.reps && (
                <View style={styles.infoItem}>
                  <Ionicons name="repeat-outline" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{workout.sets} sets, {workout.reps} reps</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Ionicons name="fitness-outline" size={20} color="#6B7280" />
                <Text style={styles.infoText}>{workout.difficulty}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Workout</Text>
              <Text style={styles.description}>{workout.description}</Text>
            </View>

            {/* Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workout Steps</Text>
              {workout.steps.map((step: string, index: number) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Start Workout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <LinearGradient
              colors={['#DD00FF', '#7650FF']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Ionicons name="play" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Start Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DD00FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    borderStyle: 'solid',
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default WorkoutDetailScreen;
