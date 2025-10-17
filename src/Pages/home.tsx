import { View } from "react-native";
import Button from "../Components/button";
import {useState} from "react";
import Camera from "../Components/Camera/camera";


const Home = () => {
	// TODO: Will remove later
	const [popupContent, setPopupContent] = useState(false);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={()=>{setPopupContent(true)}} primaryColor='#DD00FF' secondaryColor='#7650FF' textColor='#FFFFFF' text='Open Camera' fontSize={15} width={150}/>
			<Camera visible={popupContent} setVisible={setPopupContent}/>
    </View>
  );
};

export default Home;