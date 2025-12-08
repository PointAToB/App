package com.rnpotato

import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import android.util.Log
import android.widget.ImageView
import android.view.View
import java.io.File
import android.net.Uri

class MediaView(cxt: ThemedReactContext): FrameLayout(cxt) {
  private val imageLoc = File(cxt.filesDir, "tmp_image.jpg")
  val imageView: ImageView = ImageView(cxt).apply {
    layoutParams = FrameLayout.LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )
    scaleType = ImageView.ScaleType.FIT_XY
  }
  var mode: String? = null
    set(value) {
      field = value
      when(value) {
        "image" -> { imageView.setImageURI(Uri.fromFile(imageLoc)); display(imageView) }
      }
    }

  init {
    addView(imageView)
  }

  fun display(view: View) {
    for (i in 0 until this.getChildCount()) {
      this.getChildAt(i).visibility = View.GONE
    }
    view.visibility = View.VISIBLE
  }
}