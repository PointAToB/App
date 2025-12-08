package com.rnpotato

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.MediaViewManagerInterface;
import com.facebook.react.viewmanagers.MediaViewManagerDelegate;


@ReactModule(name = MediaViewManager.REACT_CLASS)
class MediaViewManager: SimpleViewManager<MediaView>(), MediaViewManagerInterface<MediaView> {
  private val delegate: MediaViewManagerDelegate<MediaView, MediaViewManager> =
    MediaViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<MediaView> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): MediaView = MediaView(context)

  @ReactProp(name = "mode")
  override fun setMode(view: MediaView, value: String?) {
    if(value == null) throw IllegalArgumentException("cameraLens is required and cannot be null | undefined")
    view?.mode = value
  }

  companion object {
    const val REACT_CLASS = "MediaView"
  }
}