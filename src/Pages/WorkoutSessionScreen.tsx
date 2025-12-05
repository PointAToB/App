import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Modal, ActivityIndicator, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Components/themeToggle';
import { WorkoutsApi, MEDIA_BASE } from '../Functions/workoutsApi';
import { WorkoutDetail, Session, Step, StepExercise, StepRest, StepNote } from '../Functions/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const WorkoutSessionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
  
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  const route = useRoute<any>();
  const { slug, sessionId: initialSessionId } = route.params as { slug: string; sessionId?: number };
  const { theme } = useTheme();

  // Data
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Local UI states
  const [isBreak, setIsBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showSettings, setShowSettings] = useState(false);
  const [breakDuration, setBreakDuration] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const cameraRef = useRef<any>(null);

  // Load workout and ensure session
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const w = await WorkoutsApi.detail(slug);
        setWorkout(w);
        const sess = initialSessionId ? await WorkoutsApi.sendEvent(initialSessionId, { type: 'start_rest' as any }).catch(() => null) : null; // no-op ping if provided
        const started = sess && sess.id ? sess : await WorkoutsApi.startOrResume(w.id);
        setSession(started);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);


  // Helpers
  const stepByOrder = (order: number | undefined): Step | undefined =>
    workout?.steps.find(s => s.order === order);

  const currentStep: Step | undefined = useMemo(
    () => stepByOrder(session?.current_step_order), [workout, session?.current_step_order]
  );


  useEffect(() => {
  if (currentStep && currentStep.kind === 'REST') {
    setIsBreak(true);
    setBreakTime(breakDuration);
  } else {
    setIsBreak(false);
    setBreakTime(breakDuration);
  }
}, [currentStep?.id, breakDuration]);

  const isCompleted = session?.status === 'COMPLETED';

  // Break countdown (when timer is 0 on a REST step, send end_rest)
  useEffect(() => {
    if (!isBreak) return;
    if (breakTime <= 0) return;

    const timeout = setTimeout(async () => {
      if (breakTime > 1) {
        setBreakTime(breakTime - 1);
      } else {
        // Timer finished
        if (session && currentStep?.kind === 'REST') {
          try {
            const next = await WorkoutsApi.sendEvent(session.id, {
              type: 'end_rest',
              workout_step_id: currentStep.id,
            });
            setSession(next);
          } catch (e) {
            console.warn('auto end_rest failed', e);
          }
        }

        setIsBreak(false);
        setBreakTime(breakDuration);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isBreak, breakTime, breakDuration, session, currentStep]);  

  useEffect(() => {
    if (isCompleted) {
      navigation.goBack();
    }
  }, [isCompleted, navigation]);

  // Actions / API events
  const completeSet = async () => {
    if (!session || !currentStep || currentStep.kind !== 'EXERCISE') return;
    const setIdx = session.current_set_index;
    const next = await WorkoutsApi.sendEvent(session.id, {
      type: 'complete_set',
      workout_step_id: currentStep.id,
      set_index: setIdx,
    });
    setSession(next);
    Vibration.vibrate(5);
  };

  const goPrevious = () => {
    if (!session || !workout) return;
  
    const currentOrder = session.current_step_order;
    const currentSet = session.current_set_index;
    const step = workout.steps.find(s => s.order === currentOrder);
  
    // If in an exercise and not on the first set, go back one set
    if (step?.kind === 'EXERCISE' && currentSet > 1) {
      setSession(prev =>
        prev ? { ...prev, current_set_index: prev.current_set_index - 1 } : prev
      );
      return;
    }
  
    // Otherwise go to the previous step
    const prevSteps = workout.steps.filter(s => s.order < currentOrder && s.kind !== 'REST');
    if (!prevSteps.length) return;

    const prevStep = prevSteps[prevSteps.length - 1];
  
    setSession(prev =>
      prev
        ? {
            ...prev,
            current_step_order: prevStep.order,
            current_set_index: 1,
          }
        : prev
    );
    Vibration.vibrate(1);             // temporary vibration
  };

  const startBreak = async () => {                              //start break
    setIsBreak(true);
    setBreakTime(breakDuration);
    if (session) {
      await WorkoutsApi.sendEvent(session.id, { type: 'start_rest' });
    }
    Vibration.vibrate(5);
  };

  const endBreak = async () => {                              //end break
    setIsBreak(false);
    setBreakTime(breakDuration);
    if (session && currentStep?.kind === 'REST') {
      const next = await WorkoutsApi.sendEvent(session.id, { type: 'end_rest', workout_step_id: currentStep.id });
      setSession(next);
    }
    Vibration.vibrate(5);
  };

  const skipStep = async () => {
    if (!session || !currentStep) return;
    const next = await WorkoutsApi.sendEvent(session.id, { type: 'skip_step', workout_step_id: currentStep.id });
    setSession(next);
  };

  const handleQuit = () => navigation.goBack();

  // Render guards
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!workout || !session) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Unable to load workout.</Text>
      </View>
    );
  }

  if (!currentStep) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
          Workout complete
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#fff', borderRadius: 12 }}
        >
          <Text style={{ color: '#000', fontWeight: '600' }}>Back to workouts</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Current step views
  const isExercise = currentStep.kind === 'EXERCISE';
  const isRest = currentStep.kind === 'REST';
  const isNote = currentStep.kind === 'NOTE';

  // Pull info for exercise
  const ex = isExercise ? (currentStep as StepExercise).exercise : null;
  const totalSets = isExercise ? (currentStep as StepExercise).sets : 1;
  const totalReps = isExercise ? (currentStep as StepExercise).reps_or_seconds : 1;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000000', '#000000']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>{workout.title}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Break Screen (REST and manual breaks) */}
          {isBreak && (
            <View style={styles.breakContainer}>
              <Text style={styles.breakExerciseName}>Rest</Text>
              <Text style={styles.breakSetInfo}>
                {isRest ? `Next up: step ${currentStep.order + 1}` : 'Pause and catch your breath'}
              </Text>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{breakTime}s</Text>
                <Text style={styles.timerLabel}>Countdown</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.endBreakButton} onPress={endBreak}>
                  <Text style={styles.buttonText}>End Break</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
                  <LinearGradient colors={['#FF6B35', '#FF4500']} style={styles.gradientButton}>
                    <Text style={styles.quitButtonText}>Quit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Note Screen */}
          {isNote && !isBreak && (
            <View style={styles.noteContainer}>
              <ScrollView style={styles.noteScroll} contentContainerStyle={styles.noteContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.exerciseName}>{(currentStep as StepNote).note_title || 'Note'}</Text>
                <Text style={styles.setInfo}>{(currentStep as StepNote).note_body_md}</Text>
              </ScrollView>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.startBreakButton} onPress={skipStep}>
                  <Text style={styles.startBreakText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Exercise Screen */}
          {isExercise && !isBreak && (
            <ScrollView style={styles.exerciseContainer} contentContainerStyle={styles.exerciseContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.exerciseName}>{ex?.name}</Text>
              <Text style={styles.setInfo}>
                Set {session.current_set_index} of {totalSets}{' '}
                {ex?.unit_type === 'SECONDS' ? `• ${totalReps}s each` : `• ${totalReps} reps`}
              </Text>

              <View style={[styles.visualContainer, showCamera && styles.visualContainerLarge]}>
                {showCamera ? (
                  permission?.granted ? (
                    <View style={styles.cameraWrapper}>
                      <CameraView
                        ref={cameraRef}
                        style={styles.cameraView}
                        facing="front"
                      />
                    </View>
                  ) : (
                    <View style={styles.permissionContainer}>
                      <Text style={styles.permissionText}>Camera access is needed</Text>
                      <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                        <Text style={styles.permissionBtnText}>Grant Permission</Text>
                      </TouchableOpacity>
                    </View>
                  )
                ) : (
                  <Image
                  source={{uri: ex?.media?.[0]?.url?.startsWith('http')? ex.media[0].url: `${MEDIA_BASE}/media/${ex?.media?.[0]?.url}`,}}
                  style={styles.exerciseImage}
                />
              )}
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Steps:</Text>
                {(ex?.instructions_md || ex?.summary || '')
                  .split('\n')
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((line, idx) => (
                    <Text key={idx} style={styles.infoStep}>• {line.trim()}</Text>
                  ))}
              </View>

              <View style={styles.currentProgressContainer}>
                <Text style={styles.currentProgress}>
                  Set {session.current_set_index} of {totalSets}
                </Text>
              </View>

              <View style={styles.buttonRow}>
                {/* Left arrow: go to previous step */}        
                <TouchableOpacity style={styles.navButton} onPress={goPrevious}>
                  <Text style={styles.navButtonSymbol}>{'⏴⏴'}</Text>
                </TouchableOpacity>

                {/* Middle: manual break */}
                <TouchableOpacity style={styles.startBreakButton} onPress={startBreak}>
                  <Text style={styles.startBreakText}>Start Break</Text>
                </TouchableOpacity>

                {/* Right arrow: go to next step */}
                <TouchableOpacity style={styles.navButton} onPress={completeSet}>
                  <Text style={styles.navButtonSymbol}>{'⏵⏵'}</Text>
                </TouchableOpacity>
              </View>

              {!showCamera && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.cameraButton} onPress={() => setShowCamera(true)}>
                    <LinearGradient colors={[theme.primaryColor, theme.secondaryColor]} style={styles.cameraGradientButton}>
                      <Text style={styles.cameraButtonText}>Enable Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
                    <Ionicons name="settings-outline" size={20} color="#1A1A1A" />
                    <Text style={styles.settingsButtonText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showCamera && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.disableCameraButton} onPress={() => setShowCamera(false)}>
                    <Text style={styles.disableCameraButtonText}>Disable Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>

      {/* Settings */}
      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workout Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Break Timer Duration</Text>
                <Text style={styles.settingDescription}>Select break time between sets</Text>
                <View style={styles.breakDurationButtons}>
                  {[15, 30, 45, 60, 90].map((d) => (
                    <TouchableOpacity key={d} onPress={() => setBreakDuration(d)} style={[styles.durationButton, breakDuration === d && styles.durationButtonActive, { backgroundColor: theme.primaryColor }]}>
                      <Text style={[styles.durationButtonText, breakDuration === d && styles.durationButtonTextActive]}>{d}s</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//styles
const styles = StyleSheet.create({
  container: { flex: 1 }, gradient: { flex: 1 }, safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: { padding: 8, width: 40 }, appTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center' }, placeholder: { width: 40 },
  breakContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  breakExerciseName: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  breakSetInfo: { fontSize: 18, color: '#CCCCCC', marginBottom: 40 },
  timerContainer: { alignItems: 'center', marginBottom: 40 }, timerText: { fontSize: 80, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 }, timerLabel: { fontSize: 20, color: '#CCCCCC' },
  buttonContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  endBreakButton: { backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 60, borderRadius: 32, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },
  quitButton: { borderRadius: 32, overflow: 'hidden' }, gradientButton: { paddingVertical: 12, paddingHorizontal: 150, alignItems: 'center' }, quitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  exerciseContainer: { flex: 1 }, exerciseContent: { paddingHorizontal: 20, paddingBottom: 0 },
  exerciseName: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  setInfo: { fontSize: 18, color: '#CCCCCC', marginBottom: 16 },
  visualContainer: { height: 220, backgroundColor: '#000', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  visualContainerLarge: { height: SCREEN_HEIGHT * 0.55, minHeight: 400 },
  exerciseImage: { width: '100%', height: '100%', borderRadius: 16, resizeMode: 'contain' },
  cameraView: { width: '100%', height: '100%', borderRadius: 16 }, cameraWrapper: { width: '100%', height: '100%', position: 'relative' },
  permissionContainer: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16 },
  permissionText: { color: '#FFFFFF', marginBottom: 8 }, permissionBtn: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  permissionBtnText: { color: '#000000', fontWeight: '600' },

  infoSection: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, marginBottom: 16 },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 }, infoStep: { fontSize: 14, color: '#CCCCCC', marginBottom: 4 },
  currentProgressContainer: { alignItems: 'center', marginBottom: 20 }, currentProgress: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },

  buttonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  navButtonSymbol: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  startBreakButton: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 32, alignItems: 'center', marginHorizontal: 8 },
  startBreakText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },
  noteContainer: { flex: 1, paddingHorizontal: 20, paddingBottom: 20, },
  noteScroll: { flex: 1, },
  noteContent: { paddingBottom: 16, },

  bottomButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cameraButton: { flex: 1, borderRadius: 32, overflow: 'hidden' }, cameraGradientButton: { paddingVertical: 12, alignItems: 'center' },
  cameraButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  settingsButton: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderRadius: 32 },
  settingsButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },
  disableCameraButton: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  disableCameraButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }, closeButton: { padding: 4 },
  modalBody: { padding: 20 }, settingSection: { marginBottom: 24 },
  settingLabel: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  settingDescription: { fontSize: 14, color: '#CCCCCC', marginBottom: 12 },
  breakDurationButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  durationButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 2, borderColor: 'transparent' },
  durationButtonActive: { backgroundColor: '#DD00FF', borderColor: '#7650FF' },
  durationButtonText: { color: '#CCCCCC', fontSize: 16, fontWeight: '600' },
  durationButtonTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
});
export default WorkoutSessionScreen;