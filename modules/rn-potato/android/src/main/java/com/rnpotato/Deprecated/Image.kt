package com.rnpotato

import androidx.camera.core.ImageCapture
import androidx.camera.core.ExperimentalZeroShutterLag
import com.facebook.react.uimanager.ThemedReactContext
import java.io.File
import androidx.core.content.ContextCompat
import android.widget.ImageView
import android.widget.FrameLayout
import androidx.camera.core.ImageCaptureException
import android.util.Log
import android.view.ViewGroup.LayoutParams
import android.view.View
import android.net.Uri
// jdj
import android.graphics.Color


@ExperimentalZeroShutterLag
class Image(private val cxt: ThemedReactContext, private val parent: RnPotatoView) {
    private val loc = File(cxt.filesDir, "tmp_image.jpg")
    private val outputOptions = ImageCapture.OutputFileOptions.Builder(loc).build()
    val useCase: ImageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_ZERO_SHUTTER_LAG).build()

    fun capture() {
      Log.i(TAG, "Captured")
      useCase.takePicture(outputOptions, ContextCompat.getMainExecutor(cxt), object: ImageCapture.OnImageSavedCallback {
        override fun onImageSaved(output: ImageCapture.OutputFileResults) {
          display(output)
        }
        override fun onError(exception: ImageCaptureException) {
          Log.e(TAG, "Image capture failed: ${exception.message}", exception)
        }
      })
    }

    private fun display(output: ImageCapture.OutputFileResults) {
      val imageView: ImageView = ImageView(cxt).apply {
        layoutParams = FrameLayout.LayoutParams(
          LayoutParams.MATCH_PARENT,
          LayoutParams.MATCH_PARENT
        )
      }

      imageView.setImageURI(Uri.fromFile(loc))
      parent.addView(imageView)

      Log.i(TAG, "parent=${parent}, parent.id=${parent.id}, parent.parent=${parent.parent}")

    }


  companion object {
    const val TAG = "ImageCapture"
  }
}