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


class UseCaseHandler(cxt: ThemedReactContext) {
  private val image = Image(cxt)
  private val video = Video(cxt)
  private val live = Live(cxt)
  var useCase: UseCase? = null
  var mode: String? = null
    set(value) {
      field = value
      when(value) {
        "image" -> this.useCase = image.useCase
        "video" -> this.useCase = video.useCase
        "live" -> this.useCase = live.useCase
      }
    }


  fun capture() {
    when(this.mode) {
      "image" -> image.capture()
      "video" -> video.capture()
      "live" -> live.capture()
    }
  }
  fun display
}

@ExperimentalZeroShutterLag
class Image(cxt: ThemedReactContext) {
  private val loc = File(cxt.filesDir, "tmp_image.jpg")
  private val outputOptions = ImageCapture.OutputFileOptions.Builder(loc).build()
  val useCase: ImageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_ZERO_SHUTTER_LAG).build()

  fun capture() {
    useCase.takePicture(outputOptions, ContextCompat.getMainExecutor(cxt), object: ImageCapture.OnImageSavedCallback {
      override fun onImageSaved(output: ImageCapture.OutputFileResults) = Unit
      override fun onError(exception: ImageCaptureException) { Log.e("CameraX", "Image capture failed: ${exception.message}", exception) }
    })
  }
}

class Video(cxt: ThemedReactContext) {
  private val loc = File(cxt.cacheDir, "tmp_video.mp4")
  private val outputOptions: FileOutputOptions = FileOutputOptions.Builder(loc).build()
  private val recorder: Recorder = Recorder.Builder().setQualitySelector(QualitySelector.from(Quality.HIGHEST)).build()
  var useCase: VideoCapture<Recorder> = VideoCapture.withOutput<Recorder>(recorder)
  private val recording = useCase.output.prepareRecording(cxt, outputOptions)
  private var stream: Recording? = null

  fun capture() {
    stream?.stop()

    if(stream == null) {
      stream = recording.start(ContextCompat.getMainExecutor(cxt)) { event ->
        if(event is VideoRecordEvent.Finalize) { stream = null }
      }
    }
  }
}

class Live(cxt: ThemedReactContext) {
  val useCase: ImageAnalysis = ImageAnalysis.Builder().build()

  fun capture() = Unit
}
