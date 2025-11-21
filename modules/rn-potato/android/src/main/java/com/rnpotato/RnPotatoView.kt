package com.rnpotato

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import android.util.Log
import com.rnpotato.databinding.CameraUiBinding
import androidx.camera.lifecycle.ProcessCameraProvider
import com.google.common.util.concurrent.ListenableFuture
import androidx.camera.core.Preview
import androidx.camera.core.CameraSelector
import android.view.LayoutInflater
//
import androidx.camera.view.LifecycleCameraController
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.uimanager.ThemedReactContext
import android.util.Size
import androidx.camera.view.CameraController
import androidx.camera.view.PreviewView


class RnPotatoView : FrameLayout {
  constructor(context: ThemedReactContext) : super(context) { configureComponent() }
  constructor(context: ThemedReactContext, attrs: AttributeSet?) : super(context, attrs) { configureComponent() }
  constructor(context: ThemedReactContext, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) { configureComponent() }

  private lateinit var binding : CameraUiBinding
  private val controller = LifecycleCameraController(context)

  fun configureComponent() {
    controller.previewTargetSize = CameraController.OutputSize(Size(1920, 1080))
    binding = CameraUiBinding.inflate(LayoutInflater.from(context), this, true)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    val activity = (context as ThemedReactContext).currentActivity
    if (activity is LifecycleOwner) {

      binding.previewView.scaleType = PreviewView.ScaleType.FILL_CENTER
      binding.previewView.implementationMode = PreviewView.ImplementationMode.COMPATIBLE
      binding.previewView.setController(controller)

      controller.cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA
      controller.bindToLifecycle(activity)
      Log.i("watermelon", "runs") //1600x1200
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    controller.unbind()
  }


}
