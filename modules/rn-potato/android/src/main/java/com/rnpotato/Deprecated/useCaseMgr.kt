package com.rnpotato

import com.facebook.react.uimanager.ThemedReactContext
import androidx.camera.core.UseCase
import android.widget.FrameLayout
import android.util.Log

class UseCaseMgr(private val cxt: ThemedReactContext, private val parent: RnPotatoView) {
    private val image: Image = Image(cxt, parent)
    private val video: Video = Video(cxt, parent)
    private val live: Live = Live(cxt, parent)
    var useCase: UseCase? = null

    fun capture() {
      //clear()
      when(useCase) {
        image.useCase -> image.capture()
        video.useCase -> video.capture()
        live.useCase -> live.capture()
      }
    }

  fun setUseCase(name: String?) {
    this.useCase = when(name) {
      "image" -> image.useCase as UseCase
      "video" -> video.useCase as UseCase
      else -> live.useCase as UseCase
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

  companion object {
    const val TAG = "RnPotatoView"
  }
}

