import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WorkoutCard from '../Components/WorkoutCard';
import { useTheme } from '../Components/themeToggle';

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
  const { theme } = useTheme();
  // Workout types - categories to choose from
  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Cardio',
      duration: 'Various',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      description: 'Get your heart pumping with high-energy cardio workouts!',
      steps: [
        '5 min warm-up walk',
        '30 min cardio session',
        '5 min cool-down'
      ]
    },
    {
      id: '2',
      title: 'Strength Training',
      duration: 'Various',
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop',
      description: 'Build muscle and strength with progressive resistance training.',
      steps: [
        '10 min warm-up',
        'Strength exercises',
        '10 min cool-down'
      ]
    },
    {
      id: '3',
      title: 'Yoga',
      duration: 'Various',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      description: 'Find balance and flexibility through mindful movement.',
      steps: [
        'Meditation',
        'Yoga poses',
        'Relaxation'
      ]
    },
    {
      id: '4',
      title: 'HIIT',
      duration: 'Various',
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      description: 'High-intensity interval training for maximum calorie burn.',
      steps: [
        '5 min warm-up',
        'HIIT intervals',
        '5 min cool-down'
      ]
    },
  ];

  const handleWorkoutPress = (workout: Workout) => {
    // Navigate to exercise list for this workout type
    (navigation as any).navigate('ExerciseList', { workoutType: workout.title });
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Workouts</Text>
          <Text style={[styles.subheading, { color: theme.secondaryText }]}>Select Your Interests</Text>
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
