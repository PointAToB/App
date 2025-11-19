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
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import android.view.LayoutInflater
import java.util.concurrent.TimeUnit


class RnPotatoView : FrameLayout, LifecycleOwner {
  constructor(context: Context) : super(context) { configureComponent() }
  constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) { configureComponent() }
  constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) { configureComponent() }

  private lateinit var cameraProviderFuture : ListenableFuture<ProcessCameraProvider>
  private val lifecycleRegistry = LifecycleRegistry(this)
  private lateinit var binding : CameraUiBinding
  private var isMounted : Boolean = false
  private fun configureComponent() {
    Log.e("Watermelon", "Started")
    cameraProviderFuture = ProcessCameraProvider.getInstance(context)
    binding = CameraUiBinding.inflate(LayoutInflater.from(context), this, true)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    // If the component has already been mounted, prevents mounting again, unless new instance.
    if (isMounted) return

    isMounted = true
    start()
    camera({provider ->
      var preview : Preview = Preview.Builder().build()

      var cameraSelector : CameraSelector = CameraSelector.Builder().requireLensFacing(CameraSelector.LENS_FACING_FRONT).build()

      preview.setSurfaceProvider(binding.previewView.getSurfaceProvider())

      var camera = provider.bindToLifecycle(this, cameraSelector, preview)
    })
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    isMounted = false
    destroy()
  }

  private fun camera(func: (provider: ProcessCameraProvider) -> Unit) {
    cameraProviderFuture.addListener(Runnable {
      val provider = cameraProviderFuture.get(5, TimeUnit.SECONDS)
      func(provider)
    }, ContextCompat.getMainExecutor(context))
  }

  fun start() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START) }
  fun stop() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP) }
  fun destroy() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY) }

  override val lifecycle: Lifecycle
    get() = lifecycleRegistry
}

