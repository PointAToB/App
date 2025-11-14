import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  id: string;
  title: string;
  sets?: string;
  reps?: string;
  duration: string;
  difficulty: string;
  description: string;
  steps: string[];
}

const WorkoutSessionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params as { workout: Exercise };
  
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showSettings, setShowSettings] = useState(false);
  const [breakDuration, setBreakDuration] = useState(30);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  const totalSets = workout.sets ? parseInt(workout.sets) : 1;
  const totalReps = workout.reps ? parseInt(workout.reps) : 1;
  
  // Timer countdown for breaks
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<any>(null);
  
  useEffect(() => {
    if (isBreak && !isPaused) {
      breakIntervalRef.current = setInterval(() => {
        setBreakTime((prev) => {
          if (prev <= 1) {
            setIsBreak(false);
            setBreakTime(30);
            if (currentRep < totalReps) {
              setCurrentRep(currentRep + 1);
            } else if (currentSet < totalSets) {
              setCurrentSet(currentSet + 1);
              setCurrentRep(1);
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    };
  }, [isBreak, isPaused, currentRep, currentSet, totalReps, totalSets]);

  // Reset camera ready state when camera is disabled
  useEffect(() => {
    if (!showCamera) {
      setCameraReady(false);
    }
  }, [showCamera]);
  
  const handleStartBreak = () => {
    setIsBreak(true);
    setBreakTime(breakDuration);
  };
  
  const handleEndBreak = () => {
    setIsBreak(false);
    setBreakTime(30);
  };
  
  const handleNextExercise = () => {
    setIsBreak(false);
    if (currentRep < totalReps) {
      setCurrentRep(currentRep + 1);
    } else if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setCurrentRep(1);
    }
  };
  
  const handlePreviousExercise = () => {
    if (currentRep > 1) {
      setCurrentRep(currentRep - 1);
    } else if (currentSet > 1) {
      setCurrentSet(currentSet - 1);
      setCurrentRep(totalReps);
    }
  };
  
  const handleQuit = () => {
    navigation.goBack();
  };
  
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>THE Fitness App</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Break Screen */}
          {isBreak && (
            <View style={styles.breakContainer}>
              <Text style={styles.breakExerciseName}>{workout.title}</Text>
              <Text style={styles.breakSetInfo}>Set {currentSet} of {totalSets}</Text>
              
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{breakTime}s</Text>
                <Text style={styles.timerLabel}>Countdown</Text>
              </View>
              
              <View style={styles.didYouKnowContainer}>
                <Text style={styles.didYouKnowTitle}>Did You Know?</Text>
                <Text style={styles.didYouKnowText}>
                  {workout.title} is one of the most challenging exercises.
                </Text>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.endBreakButton}
                  onPress={handleEndBreak}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#DD00FF', '#7650FF']}
                    style={styles.endBreakGradient}
                  >
                    <Ionicons name="play" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>End Break</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quitButton}
                  onPress={handleQuit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF4444']}
                    style={styles.gradientButton}
                  >
                    <Ionicons name="exit-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.quitButtonText}>Quit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Exercise Screen */}
          {!isBreak && (
            <ScrollView 
              style={styles.exerciseContainer}
              contentContainerStyle={styles.exerciseContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.exerciseName}>{workout.title}</Text>
              <Text style={styles.setInfo}>{totalSets} sets, {totalReps} reps</Text>
              
              <View style={[styles.visualContainer, showCamera && styles.visualContainerLarge]}>
                {showCamera ? (
                  permission?.granted ? (
                    <View style={styles.cameraWrapper}>
                      <CameraView 
                        ref={cameraRef}
                        style={styles.cameraView} 
                        facing={cameraFacing}
                        onCameraReady={() => {
                          // Camera preview is ready for pose detection
                          setCameraReady(true);
                          console.log('Camera is ready for pose detection');
                        }}
                      />
                      {!cameraReady && (
                        <View style={styles.cameraLoadingContainer}>
                          <Text style={styles.cameraLoadingText}>Camera loading...</Text>
                        </View>
                      )}
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
                  <View style={styles.cameraPlaceholder}>
                    <LinearGradient
                      colors={['rgba(221, 0, 255, 0.15)', 'rgba(118, 80, 255, 0.15)']}
                      style={styles.placeholderGradient}
                    >
                      <View style={styles.placeholderIconContainer}>
                        <View style={styles.placeholderIconCircle}>
                          <Ionicons name="camera-outline" size={64} color="#DD00FF" />
                        </View>
                      </View>
                      <Text style={styles.placeholderTitle}>Enable Camera</Text>
                      <Text style={styles.placeholderSubtitle}>
                        Track your form with real-time pose detection
                      </Text>
                      <View style={styles.placeholderFeatures}>
                        <View style={styles.placeholderFeature}>
                          <Ionicons name="checkmark-circle" size={20} color="#DD00FF" />
                          <Text style={styles.placeholderFeatureText}>Form correction</Text>
                        </View>
                        <View style={styles.placeholderFeature}>
                          <Ionicons name="checkmark-circle" size={20} color="#DD00FF" />
                          <Text style={styles.placeholderFeatureText}>Progress tracking</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Key Cues</Text>
                {(workout.steps.slice(0, 3)).map((step: string, index: number) => (
                  <Text key={index} style={styles.infoStep}>• {step}</Text>
                ))}
              </View>
              
              <View style={styles.currentProgressContainer}>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressLabel}>Set {currentSet} of {totalSets}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressLabel}>Rep {currentRep} of {totalReps}</Text>
                </View>
              </View>
              
              {/* Navigation and Break Button Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.navButton} 
                  onPress={handlePreviousExercise}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.startBreakButton}
                  onPress={handleStartBreak}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#DD00FF', '#7650FF']}
                    style={styles.startBreakGradient}
                  >
                    <Ionicons name="pause" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.startBreakText}>Start Break</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navButton} 
                  onPress={handleNextExercise}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              {/* Camera and Settings Button Row */}
              {!showCamera && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={() => setShowCamera(true)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#DD00FF', '#7650FF']}
                      style={styles.cameraGradientButton}
                    >
                      <Ionicons name="camera" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                      <Text style={styles.cameraButtonText}>Enable Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={() => setShowSettings(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Camera Controls (when camera is enabled) */}
              {showCamera && (
                <View style={styles.bottomButtons}>
                  {!cameraReady && (
                    <View style={styles.cameraStatusContainer}>
                      <Text style={styles.cameraStatusText}>Camera initializing...</Text>
                    </View>
                  )}
                  {cameraReady && (
                    <View style={styles.cameraStatusContainer}>
                      <Ionicons name="checkmark-circle" size={20} color="#DD00FF" />
                      <Text style={styles.cameraStatusTextActive}>Camera ready for pose detection</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.disableCameraButton}
                    onPress={() => {
                      setShowCamera(false);
                      setCameraReady(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.disableCameraButtonText}>Disable Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workout Settings</Text>
              <TouchableOpacity 
                onPress={() => setShowSettings(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Break Timer Duration */}
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Break Timer Duration</Text>
                <Text style={styles.settingDescription}>Select break time between sets</Text>
                <View style={styles.breakDurationButtons}>
                  {[15, 30, 45, 60, 90].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => setBreakDuration(duration)}
                      style={[
                        styles.durationButton,
                        breakDuration === duration && styles.durationButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.durationButtonText,
                        breakDuration === duration && styles.durationButtonTextActive
                      ]}>
                        {duration}s
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Camera Facing */}
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Camera Facing</Text>
                <Text style={styles.settingDescription}>Choose front or back camera</Text>
                <View style={styles.cameraFacingButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setCameraFacing('front');
                      if (showCamera) {
                        setCameraReady(false);
                      }
                    }}
                    style={[
                      styles.facingButton,
                      cameraFacing === 'front' && styles.facingButtonActive
                    ]}
                  >
                    <Ionicons 
                      name="camera" 
                      size={24} 
                      color={cameraFacing === 'front' ? '#FFFFFF' : '#CCCCCC'} 
                    />
                    <Text style={[
                      styles.facingButtonText,
                      cameraFacing === 'front' && styles.facingButtonTextActive
                    ]}>
                      Front
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setCameraFacing('back');
                      if (showCamera) {
                        setCameraReady(false);
                      }
                    }}
                    style={[
                      styles.facingButton,
                      cameraFacing === 'back' && styles.facingButtonActive
                    ]}
                  >
                    <Ionicons 
                      name="camera-reverse" 
                      size={24} 
                      color={cameraFacing === 'back' ? '#FFFFFF' : '#CCCCCC'} 
                    />
                    <Text style={[
                      styles.facingButtonText,
                      cameraFacing === 'back' && styles.facingButtonTextActive
                    ]}>
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sound Toggle */}
              <View style={styles.settingSection}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <Text style={styles.settingLabel}>Sound Effects</Text>
                    <Text style={styles.settingDescription}>Play sounds for timers and cues</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSoundEnabled(!soundEnabled)}
                    style={[
                      styles.toggle,
                      soundEnabled && styles.toggleActive
                    ]}
                  >
                    <View style={[
                      styles.toggleThumb,
                      soundEnabled && styles.toggleThumbActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Vibration Toggle */}
              <View style={styles.settingSection}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <Text style={styles.settingLabel}>Vibration</Text>
                    <Text style={styles.settingDescription}>Vibrate for notifications</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setVibrationEnabled(!vibrationEnabled)}
                    style={[
                      styles.toggle,
                      vibrationEnabled && styles.toggleActive
                    ]}
                  >
                    <View style={[
                      styles.toggleThumb,
                      vibrationEnabled && styles.toggleThumbActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Reset Workout Button */}
              <View style={styles.settingSection}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Reset Workout',
                      'Are you sure you want to reset this workout? This will start from the beginning.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Reset',
                          style: 'destructive',
                          onPress: () => {
                            setCurrentSet(1);
                            setCurrentRep(1);
                            setIsBreak(false);
                            setBreakTime(breakDuration);
                            setIsPaused(false);
                            setShowSettings(false);
                          }
                        }
                      ]
                    );
                  }}
                  style={styles.resetButton}
                >
                  <Ionicons name="refresh" size={20} color="#FF6B6B" />
                  <Text style={styles.resetButtonText}>Reset Workout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  // Break Screen Styles
  breakContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  breakExerciseName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  breakSetInfo: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  didYouKnowContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  didYouKnowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  didYouKnowText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  // Exercise Screen Styles
  exerciseContainer: {
    flex: 1,
  },
  exerciseContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  exerciseName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  setInfo: {
    fontSize: 17,
    color: '#CCCCCC',
    marginBottom: 20,
    fontWeight: '500',
  },
  visualContainer: {
    height: 240,
    backgroundColor: '#000000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  visualContainerLarge: {
    height: SCREEN_HEIGHT * 0.55,
    minHeight: 400,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  placeholderGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderIconContainer: {
    marginBottom: 20,
  },
  placeholderIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(221, 0, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(221, 0, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#DD00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  placeholderSubtitle: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  placeholderFeatures: {
    width: '100%',
    gap: 12,
  },
  placeholderFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderFeatureText: {
    fontSize: 15,
    color: '#E0E0E0',
    fontWeight: '600',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cameraWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  permissionContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
  },
  permissionText: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  permissionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  permissionBtnText: {
    color: '#000000',
    fontWeight: '600',
  },
  cameraLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  cameraLoadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  infoStep: {
    fontSize: 15,
    color: '#E0E0E0',
    marginBottom: 6,
    lineHeight: 22,
  },
  currentProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressBadge: {
    backgroundColor: 'rgba(221, 0, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(221, 0, 255, 0.4)',
  },
  progressLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  currentProgress: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  navButtonSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startBreakButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    elevation: 6,
    shadowColor: '#DD00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startBreakGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  startBreakText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  endBreakButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#DD00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  endBreakGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quitButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  quitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#DD00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cameraGradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cameraStatusContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cameraStatusText: {
    fontSize: 15,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  cameraStatusTextActive: {
    fontSize: 15,
    color: '#DD00FF',
    fontWeight: '700',
  },
  settingsButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  settingsButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disableCameraButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  disableCameraButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 0,
  },
  // Settings Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  breakDurationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationButtonActive: {
    backgroundColor: '#DD00FF',
    borderColor: '#7650FF',
  },
  durationButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  durationButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cameraFacingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  facingButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 8,
  },
  facingButtonActive: {
    backgroundColor: '#DD00FF',
    borderColor: '#7650FF',
  },
  facingButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  facingButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleInfo: {
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#DD00FF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutSessionScreen;
