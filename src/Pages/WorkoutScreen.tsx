import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WorkoutCard from '../Components/WorkoutCard';
import { useTheme } from '../Components/themeToggle';
import { WorkoutsApi } from '../Functions/workoutsApi';
import { WorkoutCard as WorkoutCardType } from '../Functions/types';

const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [workouts, setWorkouts] = React.useState<WorkoutCardType[]>([]);
  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await WorkoutsApi.list();
      setWorkouts(data);
    } finally {
      setLoading(false);
    }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <LinearGradient colors={[theme.background, theme.backgroundSecondary]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Workouts</Text>
          <Text style={[styles.subheading, { color: theme.secondaryText }]}>Pick up or start something new</Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {workouts.map(w => (
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
            {workouts.length === 0 && (
              <Text style={{ textAlign: 'center', color: theme.secondaryText, padding: 16 }}>
                No workouts yet.
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  subheading: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
});
export default WorkoutScreen;