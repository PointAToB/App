package com.rnpotato

import com.facebook.react.uimanager.ThemedReactContext
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import java.io.File
import androidx.core.content.ContextCompat
import android.widget.VideoView
import android.widget.FrameLayout
import android.view.View
import android.view.ViewGroup.LayoutParams
import android.net.Uri

class Video(private val cxt: ThemedReactContext, private val parent: FrameLayout) {
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
                if(event is VideoRecordEvent.Finalize) {
                    stream = null
                    display()
                }
            }
        }
    }

    private fun display() {
        val videoView: VideoView = VideoView(cxt).apply {
            layoutParams = FrameLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
            )
        }
        videoView.setVideoURI(Uri.fromFile(loc))
        parent.addView(videoView)
    }

  companion object {
    const val TAG = "Video"
  }
}