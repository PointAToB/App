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

@ExperimentalZeroShutterLag
class Image(private val cxt: ThemedReactContext) {
  private val loc = File(cxt.filesDir, "tmp_image.jpg")
  private val outputOptions = ImageCapture.OutputFileOptions.Builder(loc).build()
  val useCase: ImageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_ZERO_SHUTTER_LAG).build()
  val view: ImageView = ImageView(cxt).apply {
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
  fun display() { view.setImageURI(Uri.fromFile(loc)) }
}

class Video(private val cxt: ThemedReactContext) {
  private val loc = File(cxt.cacheDir, "tmp_video.mp4")
  private val outputOptions: FileOutputOptions = FileOutputOptions.Builder(loc).build()
  private val recorder: Recorder = Recorder.Builder().setQualitySelector(QualitySelector.from(Quality.HIGHEST)).build()
  var useCase: VideoCapture<Recorder> = VideoCapture.withOutput<Recorder>(recorder)
  private val recording = useCase.output.prepareRecording(cxt, outputOptions)
  private var stream: Recording? = null
  val view: VideoView = VideoView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
  }

  fun capture() {
    stream?.stop()
    if(stream == null) {
      stream = recording.start(ContextCompat.getMainExecutor(cxt)) { event ->
        if(event is VideoRecordEvent.Finalize) { stream = null }
      }
    }
  }
  fun display() { view.setVideoURI(Uri.fromFile(loc)) }
}