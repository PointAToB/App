package com.anonymous.CameraView

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReactApplicationContext

@ReactModule(name = CameraViewManager.REACT_CLASS)
class CameraViewManager(context: ReactApplicationContext) : SimpleViewManager<CameraView>() {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): CameraView {
        return CameraView(context)
    }


    companion object {
        const val REACT_CLASS = "CameraView"
    }
}