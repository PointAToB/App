package com.rnpotato

import android.widget.FrameLayout
//import com.rnpotato.databinding.CameraUiBinding
import android.widget.LinearLayout
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import com.facebook.react.uimanager.ThemedReactContext
import android.util.Log
import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.camera.core.*
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import androidx.core.app.ActivityCompat
import androidx.lifecycle.LifecycleOwner
import android.view.View.OnAttachStateChangeListener
import android.view.View

class RnPotatoView(private val cxt: ThemedReactContext) : FrameLayout(cxt) {
  //private var binding : CameraUiBinding
  private var viewFinder: PreviewView = PreviewView(context)
  private var cameraProvider: ProcessCameraProvider? = null
  private var lensType = CameraSelector.LENS_FACING_BACK


  init {
    viewFinder.layoutParams = LinearLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )

    addView(viewFinder)
  }

  private fun startCamera() {
    Log.i(TAG, "Camera Started")
    val cameraRes = ProcessCameraProvider.getInstance(getActivity())

    cameraRes.addListener(Runnable {
      cameraProvider = cameraRes.get()

      val cameraSelector = CameraSelector.Builder().requireLensFacing(lensType).build()
      val width = viewFinder.getWidth()
      val height = viewFinder.getHeight()

      Log.i(TAG, "Preview: width-$width height-$height")

      var preview = Preview.Builder().setTargetAspectRatio(aspectRatio(width, height)).build()

      try {
        preview?.setSurfaceProvider(viewFinder.surfaceProvider)

        cameraProvider?.bindToLifecycle(getActivity() as LifecycleOwner, cameraSelector, preview)
      } catch(exc: Exception) {
        Log.e(TAG, "Use case binding failed", exc)
      }


    }, ContextCompat.getMainExecutor(getActivity()))
  }

  private fun aspectRatio(width: Int, height: Int): Int {
    val previewRatio = max(width, height).toDouble() / min(width, height)
    if (abs(previewRatio - (4.0 / 3.0)) <= abs(previewRatio - (16.0 / 9.0))) {
      return AspectRatio.RATIO_4_3
    }
    return AspectRatio.RATIO_16_9
  }

  override fun onAttachedToWindow() {
      super.onAttachedToWindow()

      viewFinder.addOnAttachStateChangeListener(object: OnAttachStateChangeListener {
        override fun onViewAttachedToWindow(v: View) {
          Log.i(TAG, "PreviewView attached, starting camera")
          startCamera()
          Log.i(TAG, "PreviewView isAttachedToWindow=${viewFinder.isAttachedToWindow}")
        }
        override fun onViewDetachedFromWindow(v: View) {}
      })
  }

    override fun onDetachedFromWindow() {
      super.onDetachedFromWindow()
      cameraProvider?.unbindAll()
    }

    private fun getActivity(): Activity {
      return cxt.currentActivity!!
    }

  companion object {
    private val TAG = "RnPotatoView"
  }
}
