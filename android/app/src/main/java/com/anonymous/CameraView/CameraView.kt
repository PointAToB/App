package com.anonymous.CameraView


import android.widget.FrameLayout
import android.content.Context
import com.anonymous.App.databinding.CameraUiBinding
import android.view.LayoutInflater

class CameraView(context: Context) : FrameLayout(context) {
    private var binding: CameraUiBinding
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        binding = CameraUiBinding.inflate(LayoutInflater.from(context), this, true)
    }


}