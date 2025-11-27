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
import androidx.camera.core.ImageCapture


class RnPotatoView(private val cxt: ThemedReactContext) : FrameLayout(cxt) {
  private var cameraView: PreviewView = PreviewView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
  }

  // Camera Use Cases
  private val preview = Preview.Builder().build()
  private val imageCapture = ImageCapture.Builder().build()
  //private val videoCapture =
  //private val liveCapture =

  private var cameraProvider: ProcessCameraProvider? = null
  private var useCase: UseCase? = null
  var cameraLens: CameraSelector = lensSelector(CameraSelector.LENS_FACING_BACK)
    set(value) {
      cameraProvider?.unbindAll()
      field = value
      bind()
    }
  var captureMode = "image" // Default value
    set(value) {
      cameraProvider?.unbindAll()

      when(value) {
        "image" -> useCase = imageCapture
        "video" -> useCase = null
        "live" -> useCase = null
      }

      bind()
    }

  init {
    installHierarchyFitter(cameraView)
    addView(cameraView)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    cameraView.post { startCamera() }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    cameraProvider?.unbindAll()
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
      if(useCase == null) cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraLens, preview)
      else cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraLens, preview, useCase)

      preview.setSurfaceProvider(cameraView.surfaceProvider)
    } catch(exc: Exception) {
      Log.e(TAG, "UseCase binding failed", exc)
    }
  }


  fun capture() {
    Log.i(TAG, "Capturing as $captureMode")
  }

  fun lensSelector(lens: Int): CameraSelector {
    return CameraSelector.Builder().requireLensFacing(lens).build()
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
