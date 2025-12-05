import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../Components/themeToggle';
import { WorkoutsApi } from '../Functions/workoutsApi';
import { WorkoutDetail, StepExercise } from '../Functions/types';

const diffColor = (d: string) =>                                                  //Difficulty color change
  d === 'BEGINNER' ? '#DD00FF' : d === 'INTERMEDIATE' ? '#7650FF' : '#FF6B6B';

const WorkoutDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const slug = route.params?.slug as string;

  const [loading, setLoading] = React.useState(true);
  const [workout, setWorkout] = React.useState<WorkoutDetail | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await WorkoutsApi.detail(slug);
        setWorkout(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleStartWorkout = async () => {
    if (!workout) return;
    navigation.navigate('WorkoutSession', { slug: workout.slug });
  };

  if (loading || !workout) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const included = workout.steps.filter(s => s.kind === 'EXERCISE') as StepExercise[];

  return (
    <LinearGradient colors={[theme.background, theme.backgroundSecondary]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Workout Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: workout.hero_image }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <View style={styles.difficultyBadge}>
                <Text style={[styles.difficultyText, { color: diffColor(workout.difficulty) }]}>
                  {workout.difficulty === 'BEGINNER' ? 'Beginner' : workout.difficulty === 'INTERMEDIATE' ? 'Intermediate' : 'Advanced'}
                </Text>
              </View>
              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{workout.percent_complete}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>{workout.title}</Text>

            {!!workout.short_description && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>About this class</Text>
                <Text style={[styles.description, { color: theme.secondaryText }]}>{workout.short_description}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercises Included</Text>
              {included.map((s, i) => (
                <View key={s.id} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.primaryColor }]}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>
                    {s.exercise.name} — {s.sets} sets • {s.reps_or_seconds} {s.exercise.unit_type === 'SECONDS' ? 'sec' : 'reps'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <LinearGradient colors={[theme.primaryColor, theme.secondaryColor]} style={styles.buttonGradient} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>{workout.percent_complete > 0 ? 'Resume' : 'Start'} Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }, safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  backButton: { padding: 8 }, headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' }, placeholder: { width: 40 },
  scrollView: { flex: 1 },
  imageContainer: { position: 'relative', height: 250, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'space-between', alignItems: 'flex-end', padding: 16 },
  difficultyBadge: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  difficultyText: { fontSize: 14, fontWeight: '600' },
  percentBadge: { marginTop: 'auto', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  percentText: { color: '#fff', fontWeight: '700' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  description: { fontSize: 16, color: '#6B7280', lineHeight: 24 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepNumberText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 16, color: '#1F2937', lineHeight: 22 },
  buttonContainer: { padding: 20, paddingBottom: 30 },
  startButton: { borderStyle: 'solid', borderColor: '#828282', borderWidth: 1, borderRadius: 20, marginTop: 10, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginLeft: 8, textAlign: 'center' },
});
export default WorkoutDetailScreen;