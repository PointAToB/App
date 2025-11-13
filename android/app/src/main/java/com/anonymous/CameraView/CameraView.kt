package com.anonymous.CameraView


import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext;
import com.anonymous.App.databinding.CameraUiBinding
import android.view.LayoutInflater
import androidx.camera.core.Preview
import androidx.camera.core.UseCase
import androidx.camera.lifecycle.ProcessCameraProvider
import com.google.common.util.concurrent.ListenableFuture
import androidx.camera.core.CameraSelector
import kotlin.collections.mutableListOf
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner

import android.util.Size


class CameraView(context: ThemedReactContext) : FrameLayout(context) {
    private var binding: CameraUiBinding
    private lateinit var cameraProviderFuture : ListenableFuture<ProcessCameraProvider>
    private var cameraType = CameraSelector.LENS_FACING_BACK
    private val lifecycleOwner: LifecycleOwner = context.currentActivity as LifecycleOwner

    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        binding = CameraUiBinding.inflate(LayoutInflater.from(context), this, true)
        cameraProviderFuture = ProcessCameraProvider.getInstance(context)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        val preview = Preview.Builder().build()
        preview.setSurfaceProvider(binding.camera.surfaceProvider)


        camera { provider ->
            provider.unbindAll()
            provider.bindToLifecycle(lifecycleOwner, CameraSelector.DEFAULT_FRONT_CAMERA, preview)
        }
    }



    // Wrapper function simplifies setup
    fun camera(func: (cameraProvider: ProcessCameraProvider) -> Unit) {
        cameraProviderFuture.addListener(Runnable {
            val cameraProvider = cameraProviderFuture.get()
            func(cameraProvider)
        }, ContextCompat.getMainExecutor(context))
    }

    companion object {
        // Helper function, for cameraType selection
        fun selector(lensFacing: Int): CameraSelector {
            return CameraSelector.Builder().requireLensFacing(lensFacing).build()
        }
    }


}