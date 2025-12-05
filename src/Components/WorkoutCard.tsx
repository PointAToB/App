import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

type DiffUi = 'Beginner' | 'Intermediate' | 'Advanced';
type DiffServer = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface WorkoutCardProps {
  title: string;
  duration?: string;
  difficulty: DiffUi | DiffServer;
  image: string;
  percent?: number;       //percent_complete badge
  onPress: () => void;
}

const difficultyToUi = (d: DiffUi | DiffServer): DiffUi => {
  if (d === 'BEGINNER') return 'Beginner';
  if (d === 'INTERMEDIATE') return 'Intermediate';
  if (d === 'ADVANCED') return 'Advanced';
  return d as DiffUi;
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, duration = '—', difficulty, image, percent, onPress }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  const uiDiff = difficultyToUi(difficulty);

  const getDifficultyColor = (d: DiffUi) =>
    d === 'Beginner' ? '#5bbd00' : d === 'Intermediate' ? '#ff7700' : '#ff2a00';

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.difficultyBadge}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(uiDiff) }]}>{uiDiff}</Text>
          </View>
          {typeof percent === 'number' && (
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{percent}%</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginVertical: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: { position: 'relative', height: 120 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  difficultyBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  difficultyText: { fontSize: 12, fontWeight: '600' },
  percentBadge: {
    position: 'absolute', bottom: 10, right: 12, backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  percentText: { color: '#fff', fontWeight: '700' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  durationContainer: { flexDirection: 'row', alignItems: 'center' },
  durationIcon: { fontSize: 14, marginRight: 6 },
  duration: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
});

export default WorkoutCard;