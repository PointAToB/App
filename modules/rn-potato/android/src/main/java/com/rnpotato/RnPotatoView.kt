package com.rnpotato

import android.widget.FrameLayout
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import com.facebook.react.uimanager.ThemedReactContext
import android.util.Log
import android.app.Activity
import androidx.core.content.ContextCompat
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.core.UseCase
import androidx.lifecycle.LifecycleOwner
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
// Will See
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap


class RnPotatoView(private val cxt: ThemedReactContext) : FrameLayout(cxt) {
  private val preview = Preview.Builder().build()
  private var cameraProvider: ProcessCameraProvider? = null
  private lateinit var cameraLens: CameraSelector
  private var mediaMgr: MediaMgr
  private var cameraView: PreviewView = PreviewView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
  }


  init {
    installHierarchyFitter(cameraView)
    addView(cameraView)
    mediaMgr = MediaMgr(cxt, this)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    cameraView.post { startCamera() }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    cameraProvider?.unbindAll()
  }

  fun setCaptureMode(value: String) {
    cameraProvider?.unbindAll()
    mediaMgr.mode = value
    bind()
  }

  fun setCameraLens(value: String) {
    cameraProvider?.unbindAll()
    val lens = when(value) {
      "front" -> CameraSelector.LENS_FACING_FRONT
      else -> CameraSelector.LENS_FACING_BACK
    }
    cameraLens = CameraSelector.Builder().requireLensFacing(lens).build()
    bind()
  }

  fun capture() {
    Log.i(TAG, "Capture Method Called: ${mediaMgr.mode}")
    mediaMgr.capture()
    emitOnPropose(true) // Param: isSuccess
  }

  fun propose(accepted: Boolean) = Unit

  private fun startCamera() {
    val cameraRes = ProcessCameraProvider.getInstance(getActivity())
    cameraRes.addListener(Runnable {
      cameraProvider = cameraRes.get()
      bind()
    }, ContextCompat.getMainExecutor(getActivity()))
  }

  fun bind() {
    try {
      cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraLens, preview, *mediaMgr.getUseCases())

      preview.setSurfaceProvider(cameraView.surfaceProvider)
    } catch(exc: Exception) {
      Log.e(TAG, "UseCase binding failed", exc)
    }
  }

  private fun emitOnCapture(isSuccess: Boolean) {
    val surfaceId = UIManagerHelper.getSurfaceId(cxt)
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(cxt, id)
    val payload = Arguments.createMap().apply { putBoolean("success", isSuccess) }
    val event = onCaptureEvent(surfaceId, id, payload)

    eventDispatcher?.dispatchEvent(event)
  }

  inner class onCaptureEvent(surfaceId: Int, viewId: Int, private val payload: WritableMap): Event<onCaptureEvent>(surfaceId, viewId) {
    override fun getEventName() = "onCapture"
    override fun getEventData() = payload
  }

  private fun emitOnPropose(isSuccess: Boolean) {
    val surfaceId = UIManagerHelper.getSurfaceId(cxt)
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(cxt, id)
    val payload = Arguments.createMap().apply { putBoolean("success", isSuccess) }
    val event = onProposeEvent(surfaceId, id, payload)

    eventDispatcher?.dispatchEvent(event)
  }

  inner class onProposeEvent(surfaceId: Int, viewId: Int, private val payload: WritableMap): Event<onCaptureEvent>(surfaceId, viewId) {
    override fun getEventName() = "onPropose"
    override fun getEventData() = payload
  }

  private fun getActivity(): Activity {
    return cxt.currentActivity!!
  }

  private fun installHierarchyFitter(view: ViewGroup) {
    if (context is ThemedReactContext) { // only react-native setup
      view.setOnHierarchyChangeListener(object : OnHierarchyChangeListener {
        override fun onChildViewRemoved(parent: View?, child: View?) = Unit
        override fun onChildViewAdded(parent: View?, child: View?) {
          parent?.measure(
            MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY)
          )
          parent?.layout(0, 0, parent.measuredWidth, parent.measuredHeight)
        }
      })
    }
  }

  companion object {
    private val TAG = "RnPotatoView"
  }
}
