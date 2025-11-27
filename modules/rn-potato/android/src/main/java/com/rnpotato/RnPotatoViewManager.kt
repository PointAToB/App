package com.rnpotato


import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RnPotatoViewManagerInterface
import com.facebook.react.viewmanagers.RnPotatoViewManagerDelegate

import androidx.camera.core.CameraSelector
import android.util.Log

@ReactModule(name = RnPotatoViewManager.NAME)
class RnPotatoViewManager : SimpleViewManager<RnPotatoView>(),
  RnPotatoViewManagerInterface<RnPotatoView> {
  private val mDelegate: ViewManagerDelegate<RnPotatoView>

  init {
    mDelegate = RnPotatoViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<RnPotatoView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): RnPotatoView {
    return RnPotatoView(context)
  }

  @ReactProp(name = "captureMode")
  override fun setCaptureMode(view: RnPotatoView, value: String?) {
    if(value == null) throw IllegalArgumentException("captureMode is required and cannot be null | undefined")
    view?.captureMode = value
  }

  @ReactProp(name = "cameraLens")
  override fun setCameraLens(view: RnPotatoView, value: String?) {
    if(value == null) throw IllegalArgumentException("cameraLens is required and is either front | back")
    Log.i(NAME, "Called")
    view?.cameraLens = view.lensSelector(
      when(value) {
        "front" -> CameraSelector.LENS_FACING_FRONT
        else -> CameraSelector.LENS_FACING_BACK
      }
    )
  }

  companion object {
    const val NAME = "RnPotatoView"
  }
}
