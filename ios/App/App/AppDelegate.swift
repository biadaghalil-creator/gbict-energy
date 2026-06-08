import UIKit
import Capacitor
import WebKit
import WidgetKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    private let widgetHandler = WidgetMessageHandler()
    private var widgetHandlerAttached = false

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Wire the JS → native bridge that feeds the home-screen widget, and
        // refresh the widget with whatever the app last stored.
        attachWidgetHandlerIfNeeded()
        WidgetCenter.shared.reloadAllTimelines()
    }

    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // MARK: - Widget bridge

    private func attachWidgetHandlerIfNeeded() {
        guard !widgetHandlerAttached else { return }
        guard let vc = findBridgeViewController(window?.rootViewController),
              let ucc = vc.webView?.configuration.userContentController else { return }
        ucc.add(widgetHandler, name: "gbictWidget")
        widgetHandlerAttached = true
    }

    private func findBridgeViewController(_ vc: UIViewController?) -> CAPBridgeViewController? {
        guard let vc = vc else { return nil }
        if let bridge = vc as? CAPBridgeViewController { return bridge }
        for child in vc.children {
            if let found = findBridgeViewController(child) { return found }
        }
        return findBridgeViewController(vc.presentedViewController)
    }
}

/// Receives `{ token, baseUrl }` from the web app (posted via
/// `window.webkit.messageHandlers.gbictWidget`) and stores it in the shared
/// App Group so the widget extension can fetch the user's summary.
final class WidgetMessageHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard message.name == "gbictWidget",
              let body = message.body as? [String: Any] else { return }
        let defaults = UserDefaults(suiteName: "group.nl.gbict.energy")
        if let token = body["token"] as? String, !token.isEmpty {
            defaults?.set(token, forKey: "widget_token")
        }
        if let baseUrl = body["baseUrl"] as? String, !baseUrl.isEmpty {
            defaults?.set(baseUrl, forKey: "widget_baseUrl")
        }
        WidgetCenter.shared.reloadAllTimelines()
    }
}
