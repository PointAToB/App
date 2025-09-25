import Constants from 'expo-constants';

// Icons
import Coach from '@expo/vector-icons/FontAwesome6';
import Photo from '@expo/vector-icons/FontAwesome';
import Video from '@expo/vector-icons/FontAwesome5';
import Flip from '@expo/vector-icons/MaterialIcons';

//<Coach name="person" size={24} color="black" />
//<Photo name="camera" size={24} color="black" />
//<Video name="video" size={24} color="black" />
//<Flip name="cameraswitch" size={24} color="black" />


// Runtime check on whether to use expo go compatible camera function or react-native-webrtc

// Expo Go
if(Constants.ExecutionEnvironment.storeClient == 'storeClient') {

}

// Standalone / Bare Workflow
