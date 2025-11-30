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

class RnPotatoViewD(private val cxt: ThemedReactContext) : FrameLayout(cxt) {
  private val preview = Preview.Builder().build()
  private var cameraProvider: ProcessCameraProvider? = null
  private var useCaseMgr = UseCaseMgr(cxt, this)
  private lateinit var cameraLens: CameraSelector
  private var cameraView: PreviewView = PreviewView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
  }

  init {
    installHierarchyFitter(cameraView)
    addView(cameraView)

    Log.i(com.rnpotato.Image.Companion.TAG, "parent=${this} : id=${this.id}")
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
    useCaseMgr.setUseCase(value)
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

  fun capture() { useCaseMgr.capture(); Log.i(TAG, "Child Count: ${this.getChildCount()}") }
  fun propose(accepted: Boolean) {
    useCaseMgr.clear()
    if(accepted) {
      // Start mediapipe pipeline
      Log.i(TAG, "Proposal Accepted, Mediapipe Pipeline Started")
      return
    }
    Log.i(TAG, "Proposal Denied, Pipeline Reset")
    useCaseMgr.cleanUp()
  }

  private fun startCamera() {
    val cameraRes = ProcessCameraProvider.getInstance(getActivity())
    cameraRes.addListener(Runnable {
      cameraProvider = cameraRes.get()
      bind()
    }, ContextCompat.getMainExecutor(getActivity()))
  }

  fun bind() {
    try {
      if(useCaseMgr.useCase == null) cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraLens, preview)
      else cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraLens, preview, useCaseMgr.useCase)

      preview.setSurfaceProvider(cameraView.surfaceProvider)
    } catch(exc: Exception) { Log.e(TAG, "UseCase binding failed", exc) }
  }
  private fun getActivity(): Activity {
    return cxt.currentActivity!!
  }
  private fun installHierarchyFitter(view: ViewGroup) {
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

  companion object {
    private val TAG = "RnPotatoView"
  }
}