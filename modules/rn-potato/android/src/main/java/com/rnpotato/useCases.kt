package com.rnpotato

import java.io.File
import android.view.View
import com.facebook.react.uimanager.ThemedReactContext
import androidx.core.content.ContextCompat
import android.util.Log
import android.net.Uri
import androidx.camera.core.UseCase
// Video
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
// Image
import androidx.camera.core.ImageCapture
import androidx.camera.core.ExperimentalZeroShutterLag
import androidx.camera.core.ImageCaptureException
// Live
import androidx.camera.core.ImageAnalysis

@ExperimentalZeroShutterLag
class Image(cxt: ThemedReactContext) {
  private val loc = File(cxt.filesDir, "tmp_image.jpg")
  private val outputOptions = ImageCapture.OutputFileOptions.Builder(loc).build()
  val useCase: ImageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_ZERO_SHUTTER_LAG).build()
  val imageView: ImageView = ImageView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
  }

  fun capture() {
    useCase.takePicture(outputOptions, ContextCompat.getMainExecutor(cxt), object: ImageCapture.OnImageSavedCallback {
      override fun onImageSaved(output: ImageCapture.OutputFileResults) = Unit
      override fun onError(exception: ImageCaptureException) { Log.e("CameraX", "Image capture failed: ${exception.message}", exception) }
    })
  }
}