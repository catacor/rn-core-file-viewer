package com.example
import expo.modules.ReactActivityDelegateWrapper
import com.facebook.react.ReactActivityDelegate

import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String? {
        return "example"
    }

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(this,
      ReactActivityDelegate(this, getMainComponentName())
    );
  }
}
