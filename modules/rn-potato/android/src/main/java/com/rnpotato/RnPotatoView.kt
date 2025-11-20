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
import androidx.camera.view.PreviewView
import androidx.camera.core.AspectRatio


class RnPotatoView : FrameLayout {
  constructor(context: Context) : super(context) { configureComponent() }
  constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) { configureComponent() }
  constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) { configureComponent() }

  private var owner = Owner()
  private lateinit var cameraProviderFuture : ListenableFuture<ProcessCameraProvider>
  private lateinit var binding : CameraUiBinding
  private var isMounted : Boolean = false
  private lateinit var preview: Preview

  private fun configureComponent() {
    Log.e("Watermelon", "Started")
    cameraProviderFuture = ProcessCameraProvider.getInstance(context)
    binding = CameraUiBinding.inflate(LayoutInflater.from(context), this, true)
    owner.create()

    binding.previewView.post {
      preview = Preview.Builder().setTargetAspectRatio(AspectRatio.RATIO_4_3).build()
      preview.setSurfaceProvider(binding.previewView.getSurfaceProvider())
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    // If the component has already been mounted, prevents mounting again, unless new instance.
    if (isMounted) return

    isMounted = true

    camera({provider ->
        provider.unbindAll()
        var cameraSelector: CameraSelector =
          CameraSelector.Builder().requireLensFacing(CameraSelector.LENS_FACING_FRONT).build()
        provider.bindToLifecycle(owner, cameraSelector, preview)
      owner.start()
        owner.resume()
    })
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    camera({provider -> provider.unbindAll() })
    isMounted = false
    owner.pause()
    owner.stop()
  }

  private fun camera(func: (provider: ProcessCameraProvider) -> Unit) {
    cameraProviderFuture.addListener(Runnable {
      try {
        val provider = cameraProviderFuture.get(5, TimeUnit.SECONDS)
        func(provider)
      } catch (e: Exception) { Log.e("RnPotatoView", "Camera provider unavailable")}
    }, ContextCompat.getMainExecutor(context))
  }
}

class Owner : LifecycleOwner {
  private val lifecycleRegistry = LifecycleRegistry(this)

  override val lifecycle: Lifecycle
    get() = lifecycleRegistry

  fun create() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE) }
  fun start() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START) }
  fun resume() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME) }
  fun pause() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE) }
  fun stop() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP) }
  fun destroy() { lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY) }
}

