package com.rnpotato

import java.io.File
import android.view.View
import com.facebook.react.uimanager.ThemedReactContext
import androidx.core.content.ContextCompat
import android.util.Log
import android.net.Uri
import androidx.camera.core.UseCase
import android.view.ViewGroup.LayoutParams
import android.widget.FrameLayout
import androidx.camera.video.FileOutputOptions
// Video
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import android.widget.VideoView
// Image
import androidx.camera.core.ImageCapture
import androidx.camera.core.ExperimentalZeroShutterLag
import androidx.camera.core.ImageCaptureException
import android.widget.ImageView
// Live
import androidx.camera.core.ImageAnalysis

class MediaMgr(private val cxt: ThemedReactContext, private var parent: FrameLayout) {
  var mode: String? = null
  private var useCases = mutableListOf<UseCase>()

  private var image: Image = Image(cxt)

  init {
    Log.i(TAG, "Initialized")
    parent.addView(image.view)
    Log.i(TAG, "Views Successfully Created: ${parent.getChildCount() == 2}")
  }

  fun capture() {
    when(mode) {
      "image" -> image.capture()
    }
  }

  fun clear() {
    when(mode) {
      "image" -> image.clear()
    }
  }

  fun cleanUp() {
    when(mode) {
      "image" -> image.cleanUp()
    }
  }

  fun getUseCases(): Array<UseCase> {
    useCases.clear()
    when(mode) {
      "image" -> useCases.add(image.case)
    }
    return useCases.toTypedArray()
  }

  companion object {
    const val TAG = "MediaMgr"
  }
}

@ExperimentalZeroShutterLag
class Image(private val cxt: ThemedReactContext) {
  private val loc = File(cxt.filesDir, "tmp_image.jpg")
  private val outputOptions = ImageCapture.OutputFileOptions.Builder(loc).build()
  val case: ImageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_ZERO_SHUTTER_LAG).build()
  val view: ImageView = ImageView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
    scaleType = ImageView.ScaleType.FIT_XY
  }

  fun capture() {
    case.takePicture(outputOptions, ContextCompat.getMainExecutor(cxt), object: ImageCapture.OnImageSavedCallback {
      override fun onImageSaved(output: ImageCapture.OutputFileResults) {
        Log.i(MediaMgr.TAG, "Image Saved Successfully")
        view.setImageURI(Uri.fromFile(loc))
      }
      override fun onError(exception: ImageCaptureException) {
        Log.e(MediaMgr.TAG, "Image capture failed: ${exception.message}", exception)
      }
    })
  }
  // Clears the image
  fun clear() { view.setImageURI(null) }
  // Deletes the image from the filesystem
  fun cleanUp() { if(loc.exists()) loc.delete() }
}