package com.rnpotato

import com.facebook.react.uimanager.ThemedReactContext
import androidx.camera.core.UseCase
import android.widget.FrameLayout

class UseCaseMgr(private val cxt: ThemedReactContext, private val parent: FrameLayout) {
    private val image: Image = Image(cxt, parent)
    private val video: Video = Video(cxt, parent)
    private val live: Live = Live(cxt, parent)
    var useCase: UseCase? = null

    fun capture() {
        when(useCase) {
            image.useCase -> image.capture()
            video.useCase -> video.capture()
            live.useCase -> live.capture()
        }
    }

  fun setUseCase(name: String?) {
    useCase = when(name) {
      "image" -> image.useCase
      "video" -> video.useCase
      else -> live.useCase
    }
  }

  // Removes captured data from the cacheDir
  fun cleanUp() {
    cxt.deleteFile("tmp_video.mp4")
    cxt.deleteFile("tmp_image.jpg")
  }

  // Removes all child views except for cameraPreview
  fun clear() {
    val childCount = parent.getChildCount()
    if (childCount == 1) return
    parent.removeViews(1, childCount - 1)
  }
}

