package com.rnpotato

import com.facebook.react.uimanager.ThemedReactContext
import androidx.camera.core.ImageAnalysis
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout

class Live(cxt: ThemedReactContext, private val parent: FrameLayout) {
  val useCase: ImageAnalysis = ImageAnalysis.Builder().build()

  fun capture() {
    Log.i(TAG, "Captured")
  }

  companion object {
    const val TAG = "Live"
  }
}