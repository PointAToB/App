import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCard from '../Components/WorkoutCard';
import { useTheme } from '../Components/themeToggle';
import { WorkoutsApi } from '../Functions/workoutsApi';
import { WorkoutCard as WorkoutCardType } from '../Functions/types';

const ExerciseListScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const genreSlug: string | undefined = route.params?.genreSlug ?? (route.params?.workoutType ? String(route.params.workoutType).toLowerCase() : undefined);
  const difficulty: string | undefined = route.params?.difficulty;

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<WorkoutCardType[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await WorkoutsApi.list({ genre: genreSlug, difficulty });
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [genreSlug, difficulty]);

  return (
    <LinearGradient colors={[theme.background, theme.backgroundSecondary]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {genreSlug ? `${genreSlug} Workouts` : 'Filtered Workouts'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {items.map((w) => (
              <WorkoutCard
                key={w.id}
                title={w.title}
                duration={w.short_description || ' '}
                difficulty={w.difficulty}
                image={w.hero_image}
                percent={w.percent_complete}
                onPress={() => navigation.navigate('WorkoutDetail', { slug: w.slug })}
              />
            ))}
            {items.length === 0 && (
              <Text style={{ textAlign: 'center', color: theme.secondaryText, padding: 16 }}>
                Nothing here yet.
              </Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { padding: 8, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', textAlign: 'center', flex: 1 },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
});
export default ExerciseListScreen;