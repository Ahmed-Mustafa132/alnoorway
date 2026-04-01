import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Code, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IOSWebViewSetup() {
  const [copiedSection, setCopiedSection] = useState('');

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const userAgentCode = `let userAgent = "TariqAlNoorApp/iOS WebView"
webView.customUserAgent = userAgent`;

  const basicSetupCode = `import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure WebView
        let configuration = WKWebViewConfiguration()
        
        // Create WebView
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.navigationDelegate = self
        
        // Set custom User-Agent
        webView.customUserAgent = "TariqAlNoorApp/iOS WebView"
        
        // Load URL
        if let url = URL(string: "https://tarik-al-noor.base44.com") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
        
        view.addSubview(webView)
    }
}`;

  const externalLinksCode = `func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    
    guard let url = navigationAction.request.url else {
        decisionHandler(.allow)
        return
    }
    
    // Get the host of the current page
    let currentHost = webView.url?.host ?? "tarik-al-noor.base44.com"
    let targetHost = url.host ?? ""
    
    // Check if it's an external link
    if url.scheme == "http" || url.scheme == "https" {
        if targetHost != currentHost && !targetHost.contains("base44.com") {
            // External link - open in Safari
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
    }
    
    // Allow internal navigation
    decisionHandler(.allow)
}`;

  const specialLinksCode = `func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    
    guard let url = navigationAction.request.url else {
        decisionHandler(.allow)
        return
    }
    
    // Handle special schemes
    if url.scheme == "mailto" || url.scheme == "tel" {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
        decisionHandler(.cancel)
        return
    }
    
    // ... rest of the external links logic
}`;

  const completeCode = `import UIKit
import WebKit

class WebViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    var progressView: UIProgressView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupWebView()
        setupProgressView()
        loadWebsite()
    }
    
    func setupWebView() {
        let configuration = WKWebViewConfiguration()
        
        // Allow inline media playback
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.navigationDelegate = self
        webView.customUserAgent = "TariqAlNoorApp/iOS WebView"
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(webView)
    }
    
    func setupProgressView() {
        progressView = UIProgressView(progressViewStyle: .default)
        progressView.frame = CGRect(x: 0, y: 0, width: view.bounds.width, height: 2)
        view.addSubview(progressView)
        
        // Observe loading progress
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
    }
    
    func loadWebsite() {
        if let url = URL(string: "https://tarik-al-noor.base44.com") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    // Handle external links
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        
        // Handle mailto and tel
        if url.scheme == "mailto" || url.scheme == "tel" {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        
        // Handle external links
        if url.scheme == "http" || url.scheme == "https" {
            let currentHost = webView.url?.host ?? "tarik-al-noor.base44.com"
            let targetHost = url.host ?? ""
            
            if targetHost != currentHost && !targetHost.contains("base44.com") {
                // Open in Safari
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
                return
            }
        }
        
        decisionHandler(.allow)
    }
    
    // Progress bar observer
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if keyPath == "estimatedProgress" {
            progressView.progress = Float(webView.estimatedProgress)
            progressView.isHidden = webView.estimatedProgress == 1.0
        }
    }
    
    deinit {
        webView.removeObserver(self, forKeyPath: "estimatedProgress")
    }
}`;

  const infoPlistCode = `<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>base44.com</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <false/>
            <key>NSTemporaryExceptionRequiresForwardSecrecy</key>
            <true/>
        </dict>
    </dict>
</dict>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">iOS WebView Setup Guide</h1>
          <p className="text-gray-600">Complete instructions for iOS developers</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="links">External Links</TabsTrigger>
            <TabsTrigger value="complete">Complete Code</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>📱 Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">What You'll Build</h3>
                  <p className="text-gray-700">A WebView-based iOS app that loads content from the Tariq Al-Noor web platform with proper handling of external links and compliance with Apple App Store requirements.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✅ Features</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>WKWebView configuration</li>
                      <li>Custom User-Agent</li>
                      <li>External links open in Safari</li>
                      <li>Service Worker disabled</li>
                      <li>Progress indicator</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">🎯 Requirements</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>iOS 14.0 or later</li>
                      <li>Xcode 12 or later</li>
                      <li>Swift 5.0+</li>
                      <li>WebKit framework</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>1️⃣ User-Agent Configuration</span>
                    <button
                      onClick={() => copyToClipboard(userAgentCode, 'userAgent')}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'userAgent' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{userAgentCode}</code>
                  </pre>
                  <p className="mt-4 text-gray-600 text-sm">
                    This custom User-Agent allows the web platform to detect it's running in the iOS app and automatically disable Service Worker.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>2️⃣ Basic WKWebView Setup</span>
                    <button
                      onClick={() => copyToClipboard(basicSetupCode, 'basic')}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'basic' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{basicSetupCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* External Links Tab */}
          <TabsContent value="links">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>🔗 External Links Handler</span>
                    <button
                      onClick={() => copyToClipboard(externalLinksCode, 'external')}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'external' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Important:</strong> This implementation ensures all external links open in Safari, which is required by Apple App Store guidelines.
                    </p>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{externalLinksCode}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>📧 Special URL Schemes (mailto, tel)</span>
                    <button
                      onClick={() => copyToClipboard(specialLinksCode, 'special')}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'special' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{specialLinksCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Complete Code Tab */}
          <TabsContent value="complete">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📝 Complete ViewController</span>
                  <button
                    onClick={() => copyToClipboard(completeCode, 'complete')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedSection === 'complete' ? 'Copied!' : 'Copy'}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">Includes All Features:</h4>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>WKWebView with proper configuration</li>
                    <li>Custom User-Agent</li>
                    <li>External links handling</li>
                    <li>Special URL schemes (mailto, tel)</li>
                    <li>Loading progress indicator</li>
                    <li>Media playback support</li>
                  </ul>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-[600px] overflow-y-auto">
                  <code>{completeCode}</code>
                </pre>

                <Card className="bg-purple-50 border-purple-200 mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>⚙️ Info.plist Configuration</span>
                      <button
                        onClick={() => copyToClipboard(infoPlistCode, 'plist')}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedSection === 'plist' ? 'Copied!' : 'Copy'}
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{infoPlistCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle>🧪 Testing Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Internal Links
                    </h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>Navigate between pages within the app</li>
                      <li>All internal links stay within WebView</li>
                      <li>Back/forward navigation works correctly</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      External Links
                    </h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>YouTube links open in Safari</li>
                      <li>Social media links open in Safari</li>
                      <li>Any external website opens in Safari</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Special Links
                    </h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>Email links (mailto:) open Mail app</li>
                      <li>Phone links (tel:) open Phone app</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Service Worker
                    </h4>
                    <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                      <li>Check browser console - should say "Service Worker disabled"</li>
                      <li>No Service Worker errors in logs</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Account Features
                    </h4>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                      <li>User can access Delete Account page</li>
                      <li>Privacy Policy is accessible</li>
                      <li>Support form works</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-6">
                  <h4 className="font-bold text-yellow-900 mb-2">⚠️ Common Issues</h4>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p><strong>Issue:</strong> Links not opening in Safari</p>
                    <p><strong>Solution:</strong> Verify decidePolicyFor implementation</p>
                    <hr className="my-2 border-yellow-200" />
                    <p><strong>Issue:</strong> Service Worker still trying to register</p>
                    <p><strong>Solution:</strong> Check User-Agent is set correctly</p>
                    <hr className="my-2 border-yellow-200" />
                    <p><strong>Issue:</strong> Videos not playing</p>
                    <p><strong>Solution:</strong> Enable allowsInlineMediaPlayback</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-xl mb-4 text-center">📧 Need Help?</h3>
            <p className="text-center text-gray-700 mb-2">
              If you encounter any issues during implementation:
            </p>
            <p className="text-center">
              <a href="mailto:osakr100@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                osakr100@gmail.com
              </a>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Include: iOS version, Xcode version, and error logs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}