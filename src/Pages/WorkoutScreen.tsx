import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WorkoutCard from '../Components/WorkoutCard';

interface Workout {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  description: string;
  steps: string[];
}

const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  // Single cardio workout
  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Morning Cardio Blast',
      duration: '20 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      description: 'Start your day with energy! A perfect morning routine to get your blood flowing.',
      steps: [
        '5 min warm-up walk',
        '3 min jumping jacks',
        '2 min high knees',
        '3 min mountain climbers',
        '2 min burpees',
        '5 min cool-down walk'
      ]
    },
   
  ];

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutDetail' as never, { workout } as never);
  };

  return (
    <LinearGradient
      colors={['#F5F5F5', '#E5E5E5']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workouts</Text>
          <Text style={styles.subheading}>Choose a workout to start your session</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              title={workout.title}
              duration={workout.duration}
              difficulty={workout.difficulty}
              image={workout.image}
              onPress={() => handleWorkoutPress(workout)}
            />
          ))}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default WorkoutScreen;
