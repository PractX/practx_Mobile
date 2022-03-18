package com.practx_mobile;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.ReactRootView;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
// import android.os.Build;
// import android.view.View;


public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);
      super.onCreate(savedInstanceState);
  }

  
  
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "practx_Mobile";
  }
}
