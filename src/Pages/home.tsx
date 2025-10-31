import { View } from "react-native";
import {useState} from "react";
import { OpenCamera } from "./camera";


const Home = () => {
	// TODO: Will remove later
	const [popupContent, setPopupContent] = useState(false);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <OpenCamera/>
    </View>
  );
};

export default Home;