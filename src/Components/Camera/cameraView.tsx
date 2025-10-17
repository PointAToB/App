import {CameraViewComponent} from "./types";

const CameraView = (props: CameraViewComponent) => {
	const {cameraType, ref, Component} = props;


	return <Component cameraType={cameraType} ref={ref}/>
}



export default CameraView;