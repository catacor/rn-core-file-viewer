import UIKit
#if DEBUG && FB_SONARKIT_ENABLED
import FlipperKit
#endif

@UIApplicationMain
class AppDelegate: EXAppDelegateWrapper, RCTBridgeDelegate {


  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    initializeFlipper(with: application)
    
    let bridge = self.reactDelegate.createBridge(with: self, launchOptions: launchOptions)
    let rootView = self.reactDelegate.createRootView(with: bridge, moduleName: "example", initialProperties: nil)

    if #available(iOS 13.0, *) {
      rootView.backgroundColor = UIColor.systemBackground
    } else {
      rootView.backgroundColor = UIColor.white
    }

    window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = self.reactDelegate.createRootViewController()
    rootViewController.view = rootView
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()

    super.application(application, didFinishLaunchingWithOptions: launchOptions)
    return true
  }

  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  private func initializeFlipper(with application: UIApplication) {
    #if DEBUG && FB_SONARKIT_ENABLED
    let client = FlipperClient.shared()
    let layoutDescriptionMapper = SKDescriptorMapper(defaults: ())
    client?.add(FlipperKitLayoutPlugin(rootNode: application, with: layoutDescriptionMapper))
    client?.add(FKUserDefaultsPlugin(suiteName: nil))
    client?.add(FlipperKitReactPlugin())
    client?.add(FlipperKitNetworkPlugin(networkAdapter: SKIOSNetworkAdapter()))
    client?.start()
    #endif
  }
}
