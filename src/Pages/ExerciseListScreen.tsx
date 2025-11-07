import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCard from '../Components/WorkoutCard';

interface Exercise {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  description: string;
  sets?: string;
  reps?: string;
  steps: string[];
}

const ExerciseListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutType } = route.params as { workoutType: string };

  // Sample exercises based on workout type
  const getExercisesForType = (type: string): Exercise[] => {
    switch (type) {
      case 'Cardio':
        return [
          {
            id: '1',
            title: 'Morning Cardio Blast',
            duration: '20 min',
            difficulty: 'Beginner',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            description: 'Start your day with energy! A perfect morning routine.',
            sets: '3',
            reps: '5',
            steps: ['5 min warm-up walk', '3 min jumping jacks', '2 min high knees', '3 min mountain climbers', '2 min burpees', '5 min cool-down']
          },
          {
            id: '2',
            title: 'Sprint Intervals',
            duration: '15 min',
            difficulty: 'Advanced',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
            description: 'High-intensity sprint training for advanced users.',
            sets: '5',
            reps: '8',
            steps: ['5 min warm-up', '8 x 30s sprints', '5 min cool-down']
          }
        ];
      case 'Yoga':
        return [
          {
            id: '3',
            title: 'The Hundred',
            duration: '10 min',
            difficulty: 'Beginner',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
            description: 'Classic Pilates exercise to strengthen your core.',
            sets: '3',
            reps: '5',
            steps: ['Lie flat on your back', 'Lift legs and upper body', 'Pump arms up and down 100 times', 'Core engaged throughout']
          },
          {
            id: '4',
            title: 'Warrior Flow',
            duration: '25 min',
            difficulty: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
            description: 'Build strength and balance with warrior poses.',
            sets: '1',
            reps: '5',
            steps: ['Warrior 1 pose', 'Warrior 2 pose', 'Reverse warrior', 'Flow between poses']
          }
        ];
      case 'Strength Training':
        return [
          {
            id: '5',
            title: 'Push-Up Pyramid',
            duration: '15 min',
            difficulty: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop',
            description: 'Build upper body strength with progressive push-ups.',
            sets: '4',
            reps: '10',
            steps: ['Set 1: 10 reps', 'Set 2: 15 reps', 'Set 3: 10 reps', 'Set 4: 5 reps']
          }
        ];
      case 'HIIT':
        return [
          {
            id: '6',
            title: 'HIIT Burner',
            duration: '30 min',
            difficulty: 'Advanced',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
            description: 'Maximum intensity interval training.',
            sets: '4',
            reps: '10',
            steps: ['5 min warm-up', '4 rounds of 30s work/30s rest', 'Burpees, Jump Squats, Push-ups', '5 min cool-down']
          }
        ];
      default:
        return [];
    }
  };

  const exercises = getExercisesForType(workoutType);

  const handleExercisePress = (exercise: Exercise) => {
    (navigation as any).navigate('WorkoutDetail', { workout: exercise });
  };

  const handleBack = () => {
    navigation.goBack();
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
          <Text style={styles.headerTitle}>{workoutType} Exercises</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {exercises.map((exercise) => (
            <WorkoutCard
              key={exercise.id}
              title={exercise.title}
              duration={exercise.duration}
              difficulty={exercise.difficulty}
              image={exercise.image}
              onPress={() => handleExercisePress(exercise)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default ExerciseListScreen;
