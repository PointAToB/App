package com.rnpotato

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RnPotatoViewManagerInterface
import com.facebook.react.viewmanagers.RnPotatoViewManagerDelegate

@ReactModule(name = RnPotatoViewManager.NAME)
class RnPotatoViewManager : SimpleViewManager<RnPotatoView>(),
  RnPotatoViewManagerInterface<RnPotatoView> {
  private val mDelegate: ViewManagerDelegate<RnPotatoView>

  init {
    mDelegate = RnPotatoViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<RnPotatoView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): RnPotatoView {
    return RnPotatoView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: RnPotatoView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "RnPotatoView"
  }
}
