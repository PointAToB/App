import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Components/themeToggle';

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
  const { theme } = useTheme();
  
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
      setIsRecording(false);
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

  const handleStartRecording = async () => {
    if (!cameraRef.current || !cameraReady) {
      console.log('Camera is not ready yet. Please wait...');
      return;
    }

    // Check if recordAsync method exists
    if (!cameraRef.current.recordAsync || typeof cameraRef.current.recordAsync !== 'function') {
      console.log('Video recording not available on this device/version');
      alert('Video recording is not available. Camera works for pose detection.');
      return;
    }

    try {
      setIsRecording(true);
      
      // Wait a moment for camera to stabilize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to start recording
      const recordingPromise = cameraRef.current.recordAsync({
        quality: '720p',
        maxDuration: 300,
      });
      
      recordingPromise.then((recording: any) => {
        setIsRecording(false);
        console.log('Recording saved:', recording.uri);
        alert(`Recording saved: ${recording.uri}`);
      }).catch((error: any) => {
        console.log('Recording error:', error);
        setIsRecording(false);
        // Show user-friendly message
        alert('Recording is not available right now. Camera works for pose detection.');
      });
    } catch (error: any) {
      console.log('Start recording error:', error);
      setIsRecording(false);
      alert('Recording feature is not available. Camera preview works for pose detection.');
    }
  };

  const handleStopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.log('Stop recording error:', error);
        setIsRecording(false);
      }
    }
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
                >
                  <Text style={styles.buttonText}>End Break</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quitButton}
                  onPress={handleQuit}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#FF4500']}
                    style={styles.gradientButton}
                  >
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
                          // Camera preview is ready - mark as ready for pose detection
                          // Camera preview works immediately for pose detection
                          setCameraReady(true);
                          console.log('Camera is ready for pose detection');
                        }}
                      />
                      {isRecording && (
                        <View style={styles.recordingIndicator}>
                          <View style={styles.recordingDot} />
                          <Text style={styles.recordingText}>Recording...</Text>
                        </View>
                      )}
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
                  <Image source={{ uri: (workout as any).image }} style={styles.exerciseImage} />
                )}
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Key Cues</Text>
                {(workout.steps.slice(0, 3)).map((step: string, index: number) => (
                  <Text key={index} style={styles.infoStep}>• {step}</Text>
                ))}
              </View>
              
              <View style={styles.currentProgressContainer}>
                <Text style={styles.currentProgress}>
                  Set {currentSet} of {totalSets} • Rep {currentRep} of {totalReps}
                </Text>
              </View>
              
              {/* Navigation and Break Button Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.navButton} onPress={handlePreviousExercise}>
                  <Text style={styles.navButtonSymbol}>{'<<'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.startBreakButton}
                  onPress={handleStartBreak}
                >
                  <Text style={styles.startBreakText}>Start Break</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.navButton} onPress={handleNextExercise}>
                  <Text style={styles.navButtonSymbol}>{'>>'}</Text>
                </TouchableOpacity>
              </View>
              
              {/* Camera and Settings Button Row */}
              {!showCamera && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={() => setShowCamera(true)}
                  >
                    <LinearGradient
                      colors={[theme.primaryColor, theme.secondaryColor]}
                      style={styles.cameraGradientButton}
                    >
                      <Text style={styles.cameraButtonText}>Enable Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={() => setShowSettings(true)}
                  >
                    <Ionicons name="settings-outline" size={20} color="#1A1A1A" />
                    <Text style={styles.settingsButtonText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Camera Controls (when camera is enabled) */}
              {showCamera && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity 
                    style={[styles.recordButton, !cameraReady && styles.recordButtonDisabled]}
                    onPress={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={!cameraReady && !isRecording}
                  >
                    {isRecording ? (
                      <LinearGradient
                        colors={['#FF0000', '#CC0000']}
                        style={styles.recordGradientButton}
                      >
                        <Ionicons name="stop" size={20} color="#FFFFFF" />
                        <Text style={styles.recordButtonText}>Stop Recording</Text>
                      </LinearGradient>
                    ) : !cameraReady ? (
                      <View style={styles.recordButtonDisabledGradient}>
                        <Ionicons name="videocam" size={20} color="#CCCCCC" />
                        <Text style={styles.recordButtonDisabledText}>Initializing...</Text>
                      </View>
                    ) : (
                      <LinearGradient
                        colors={['#FF6B35', '#FF4500']}
                        style={styles.recordGradientButton}
                      >
                        <Ionicons name="videocam" size={20} color="#FFFFFF" />
                        <Text style={styles.recordButtonText}>Start Recording</Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.disableCameraButton}
                    onPress={() => {
                      if (isRecording) {
                        handleStopRecording();
                      }
                      setShowCamera(false);
                      setCameraReady(false);
                    }}
                  >
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
                        breakDuration === duration && styles.durationButtonActive,
                        { backgroundColor: theme.primaryColor}
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
                      cameraFacing === 'front' && styles.facingButtonActive,
                      { backgroundColor: theme.primaryColor }
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
                      soundEnabled && styles.toggleActive,
                      { backgroundColor: theme.primaryColor }
                    ]}
                  >
                    <View style={[
                      styles.toggleThumb,
                      soundEnabled && styles.toggleThumbActive                    ]} />
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
                      vibrationEnabled && styles.toggleActive,
                      { backgroundColor: theme. primaryColor }
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  setInfo: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  visualContainer: {
    height: 220,
    backgroundColor: '#000000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  recordingIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoStep: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  currentProgressContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startBreakButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  startBreakText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endBreakButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  quitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraGradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  recordButtonDisabledGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recordButtonDisabledText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordGradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
  },
  settingsButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disableCameraButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  disableCameraButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
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
