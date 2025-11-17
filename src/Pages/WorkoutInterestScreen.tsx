import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Components/themeToggle';

const WorkoutInterestScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = ['Yoga', 'Pilates', 'Stretching', 'Dance', 'Strength Training', 'HIIT', 'Calisthenics'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = () => {
    // Navigate to workouts screen with selected interests
    (navigation as any).navigate('WorkoutScreen');
  };

  const handleSkip = () => {
    // Skip and go to workouts screen without selected interests
    (navigation as any).navigate('WorkoutScreen');
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Text style={[styles.appTitle, { color: theme.text }]}>
            THE{' '}
            <Text style={styles.fitnessApp}>Fitness App</Text>
          </Text>

          {/* Instructions */}
          <View style={styles.instructionContainer}>
            <Text style={[styles.instructionTitle, { color: theme.text }]}>Select Your Interests</Text>
            <Text style={[styles.instructionSubtitle, { color: theme.secondaryText }]}>
              This helps us tailor your experience
            </Text>
          </View>

          {/* Interest Buttons */}
          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestButton,
                    isSelected && styles.interestButtonSelected,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <LinearGradient
                    colors={isSelected ? [theme.primaryColor, theme.secondaryColor] : [theme.button, theme.button]}
                    style={styles.interestGradient}
                  >
                    <Text style={[
                      styles.interestText,
                      isSelected && styles.interestTextSelected
                    ]}>
                      {interest}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
            >
              <LinearGradient
                colors={[theme.primaryColor, theme.secondaryColor]}
                style={styles.finishGradient}
              >
                <Text style={styles.finishText}>Finish</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 60,
  },
  fitnessApp: {
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
  instructionContainer: {
    marginBottom: 40,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 60,
    gap: 12,
  },
  interestButton: {
    margin: 6,
    borderRadius: 25,
    overflow: 'hidden',
  },
  interestButtonSelected: {
    elevation: 4,
    shadowColor: '#DD00FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  interestGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  interestTextSelected: {
    color: '#FFFFFF',
  },
  actionContainer: {
    alignItems: 'center',
  },
  finishButton: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 16,
    overflow: 'hidden',
  },
  finishGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#999999',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default WorkoutInterestScreen;
