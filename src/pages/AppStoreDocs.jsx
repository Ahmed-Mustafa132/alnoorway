import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, CheckCircle, Code, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AppStoreDocs() {
  const [copiedSection, setCopiedSection] = useState('');

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  // App Store Description Content
  const englishDescription = `Tariq Al-Noor is an educational platform that provides Islamic knowledge and guidance to users worldwide. The app offers a collection of religious content, articles, and lessons designed to help users learn about Islam in a clear and accessible manner.

**Features:**
- Access to Islamic educational content
- Browse articles and lessons on various Islamic topics
- Read stories of converts and those seeking guidance
- Connect with scholars and preachers for questions
- Available in multiple languages (Arabic, English, French)

**Content Categories:**
- Learning about Islam basics
- Religious guidance and support
- Islamic lectures and teachings
- Stories of faith and conversion
- Educational courses on Quran and Islamic studies

**Privacy:**
- We respect your privacy and data
- Optional account creation for personalized experience
- Clear privacy policy available in-app
- Account deletion available upon request

**Important Notes:**
- This app requires internet connection to access content
- All content is for educational purposes only
- No medical or financial advice is provided
- External links open in your default browser

The app is suitable for anyone interested in learning about Islam, whether you're new to the faith or seeking to deepen your knowledge.`;

  const arabicDescription = `طريق النور هو منصة تعليمية توفر المعرفة والإرشاد الإسلامي للمستخدمين في جميع أنحاء العالم. يقدم التطبيق مجموعة من المحتوى الديني والمقالات والدروس المصممة لمساعدة المستخدمين على تعلم الإسلام بطريقة واضحة وسهلة الوصول.

**المميزات:**
- الوصول إلى المحتوى التعليمي الإسلامي
- تصفح المقالات والدروس حول مواضيع إسلامية متنوعة
- قراءة قصص المهتدين والباحثين عن الهداية
- التواصل مع العلماء والدعاة للاستفسارات
- متوفر بعدة لغات (العربية، الإنجليزية، الفرنسية)

**فئات المحتوى:**
- تعلم أساسيات الإسلام
- الإرشاد والدعم الديني
- محاضرات وتعاليم إسلامية
- قصص الإيمان والاهتداء
- دورات تعليمية في القرآن والدراسات الإسلامية

**الخصوصية:**
- نحترم خصوصيتك وبياناتك
- إنشاء حساب اختياري لتجربة مخصصة
- سياسة خصوصية واضحة متاحة في التطبيق
- إمكانية حذف الحساب عند الطلب

**ملاحظات مهمة:**
- يتطلب التطبيق اتصالاً بالإنترنت للوصول إلى المحتوى
- جميع المحتويات لأغراض تعليمية فقط
- لا يتم تقديم أي نصائح طبية أو مالية
- الروابط الخارجية تفتح في المتصفح الافتراضي

التطبيق مناسب لأي شخص مهتم بتعلم الإسلام، سواء كنت جديدًا على الإيمان أو تسعى لتعميق معرفتك.`;

  const promotionalText = `اكتشف الإسلام بطريقة سهلة ومبسطة! 🌟
محتوى تعليمي شامل، فتاوى موثوقة، قصص ملهمة، ودورات قرآنية.
تواصل مع علماء ودعاة، واحصل على إرشاد ديني موثوق.`;

  const promotionalTextEn = `Discover Islam in an easy and simple way! 🌟
Comprehensive educational content, trusted fatwas, inspiring stories, and Quranic courses.
Connect with scholars and preachers for reliable religious guidance.`;

  const keywords = `English: Islam, Islamic education, Quran, religious guidance, faith, Islamic knowledge, Muslim learning

Arabic: إسلام، تعليم إسلامي، قرآن، إرشاد ديني، إيمان، معرفة إسلامية، تعلم إسلامي`;

  // App Review Notes
  const fullNotes = `# App Review Notes for Apple App Store Submission

Dear Apple App Review Team,

Thank you for reviewing our app. Below are important notes about our application to facilitate the review process:

## 1. App Architecture
**WebView-Based Application:**
- This app uses WKWebView to display content from our web platform
- The WebView loads content from: https://tarik-al-noor.base44.com
- This approach allows us to provide a consistent experience across platforms

## 2. External Links Handling
**All external links open in the default browser (Safari):**
- We have implemented a custom link handler
- Any link to external domains automatically opens in Safari
- Users are never trapped inside the WebView

## 3. Service Worker - Important Note
**Service Worker is DISABLED in iOS WebView:**
- We detect iOS WebView using User-Agent
- Service Worker is completely disabled on iOS app
- This is done to comply with App Store requirements

## 4. Privacy & Data Protection
**Privacy Policy:** Available in-app at /p/PrivacyPolicy
**Account Deletion:** Users can delete their account at /p/DeleteAccount
**Data Collection:** We collect minimal data (email, name for registered users)

## 5. Testing Instructions
**Test Account:** Not required - app works without login
**Main Features to Test:**
1. Browse content without login
2. Click external links (should open in Safari)
3. Navigate to Privacy Policy
4. Navigate to Delete Account page

## 6. Contact Information
**Developer Contact:** osakr100@gmail.com
**Response time:** Within 24 hours

## 7. Compliance Summary
✅ Account Deletion: Implemented and accessible
✅ Privacy Policy: Clear and accessible
✅ Terms of Service: Available
✅ External Links: Open in Safari
✅ Service Worker: Disabled on iOS
✅ Data Collection: Minimal and transparent

Thank you for your time.
Contact: osakr100@gmail.com

Best regards,
Tariq Al-Noor Development Team`;

  // iOS Setup Code
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
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
    }
    
    func loadWebsite() {
        if let url = URL(string: "https://tarik-al-noor.base44.com") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        
        if url.scheme == "mailto" || url.scheme == "tel" {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        
        if url.scheme == "http" || url.scheme == "https" {
            let currentHost = webView.url?.host ?? "tarik-al-noor.base44.com"
            let targetHost = url.host ?? ""
            
            if targetHost != currentHost && !targetHost.contains("base44.com") {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
                return
            }
        }
        
        decisionHandler(.allow)
    }
    
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

  // Screenshots data
  const screenshots = [
    {
      platform: 'Apple App Store',
      devices: [
        { name: 'iPhone 16 Pro Max (6.9")', size: '1320 × 2868', required: true },
        { name: 'iPhone 15 Pro Max (6.7")', size: '1290 × 2796', required: false },
        { name: 'iPhone 14 Pro Max (6.5")', size: '1284 × 2778', required: false },
        { name: 'iPad Pro 13"', size: '2048 × 2732', required: false },
      ]
    },
    {
      platform: 'Google Play Store',
      devices: [
        { name: 'Phone', size: '1080 × 1920', required: true },
        { name: 'Tablet 7"', size: '1200 × 1920', required: false },
        { name: 'Tablet 10"', size: '1800 × 2560', required: false },
      ]
    }
  ];

  const screenshotContent = [
    '1. الصفحة الرئيسية - Home Page',
    '2. قسم تعلم الإسلام - Learn Islam',
    '3. قسم التوبة - Repentance',
    '4. قسم الفتاوى - Fatwas',
    '5. المكتبة الإسلامية - Library',
    '6. صفحة حذف الحساب - Delete Account'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">📱 App Store Documentation</h1>
          <p className="text-gray-600">كل ما تحتاجه لرفع التطبيق على المتاجر</p>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">📝 الوصف</TabsTrigger>
            <TabsTrigger value="review">✅ المراجعة</TabsTrigger>
            <TabsTrigger value="ios">💻 الكود</TabsTrigger>
            <TabsTrigger value="screenshots">📸 الصور</TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>English Version</span>
                    <button
                      onClick={() => copyToClipboard(englishDescription, 'desc-en')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'desc-en' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">App Name:</h3>
                      <p className="text-gray-700">Tariq Al-Noor - Islamic Knowledge Platform</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Subtitle:</h3>
                      <p className="text-gray-700">Islamic Educational Content and Guidance</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Description:</h3>
                      <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                        {englishDescription}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>النسخة العربية</span>
                    <button
                      onClick={() => copyToClipboard(arabicDescription, 'desc-ar')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'desc-ar' ? 'نُسخ!' : 'نسخ'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent dir="rtl">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">اسم التطبيق:</h3>
                      <p className="text-gray-700">طريق النور - منصة المعرفة الإسلامية</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">العنوان الفرعي:</h3>
                      <p className="text-gray-700">محتوى تعليمي وإرشادي إسلامي</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">الوصف:</h3>
                      <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                        {arabicDescription}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>🌟 Promotional Text (النص الترويجي)</span>
                    <button
                      onClick={() => copyToClipboard(promotionalText + '\n\n' + promotionalTextEn, 'promo')}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'promo' ? 'نُسخ!' : 'نسخ'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>ما هو Promotional Text؟</strong> نص قصير (170 حرف) يظهر أعلى وصف التطبيق في App Store. يمكنك تحديثه بدون إصدار نسخة جديدة من التطبيق.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>متى تستخدمه؟</strong> للإعلان عن ميزة جديدة، عرض خاص، أو تحديث مهم.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold mb-2">نسخة عربية:</h4>
                      <p className="bg-white p-3 rounded-lg text-gray-700">{promotionalText}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">English Version:</h4>
                      <p className="bg-white p-3 rounded-lg text-gray-700">{promotionalTextEn}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Keywords / الكلمات المفتاحية</span>
                    <button
                      onClick={() => copyToClipboard(keywords, 'keywords')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === 'keywords' ? 'Copied!' : 'Copy'}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg text-sm">
                    {keywords}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Review Notes Tab */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📋 App Review Notes</span>
                  <button
                    onClick={() => copyToClipboard(fullNotes, 'notes')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedSection === 'notes' ? 'Copied!' : 'Copy All'}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    انسخ هذا النص وضعه في <strong>App Store Connect → App Review Information → Notes</strong>
                  </p>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-6 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto">
                  {fullNotes}
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Key Compliance Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-2 text-green-900">✅ Account Deletion</h3>
                    <p className="text-sm text-green-800">Accessible at /p/DeleteAccount</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-green-900">✅ Privacy Policy</h3>
                    <p className="text-sm text-green-800">Clear and accessible in-app</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-green-900">✅ External Links</h3>
                    <p className="text-sm text-green-800">Open in Safari automatically</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-green-900">✅ Service Worker</h3>
                    <p className="text-sm text-green-800">Disabled on iOS WebView</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* iOS Code Tab */}
          <TabsContent value="ios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>💻 Complete iOS WebView Code</span>
                  <button
                    onClick={() => copyToClipboard(completeCode, 'code')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedSection === 'code' ? 'Copied!' : 'Copy Code'}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-green-900 mb-2">Includes:</h4>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>WKWebView with proper configuration</li>
                    <li>Custom User-Agent: "TariqAlNoorApp/iOS WebView"</li>
                    <li>External links open in Safari</li>
                    <li>Special URL schemes (mailto, tel)</li>
                    <li>Loading progress indicator</li>
                    <li>Media playback support</li>
                  </ul>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-[600px] overflow-y-auto">
                  <code>{completeCode}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle>🔧 Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Create new iOS project in Xcode</li>
                  <li>Copy the code above to your ViewController</li>
                  <li>Add WebKit framework to your project</li>
                  <li>Configure Info.plist for network access</li>
                  <li>Build and test on simulator/device</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screenshots Tab */}
          <TabsContent value="screenshots">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-6 h-6" />
                    متطلبات الصور للمتاجر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    يجب تصوير <strong>5-6 لقطات شاشة</strong> من التطبيق بالمقاسات التالية:
                  </p>
                  <div className="grid gap-4">
                    {screenshotContent.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-gray-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {screenshots.map((store, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{store.platform}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {store.devices.map((device, deviceIdx) => (
                        <div 
                          key={deviceIdx} 
                          className={`p-4 rounded-lg border-2 ${device.required ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{device.name}</h4>
                              <p className="text-sm text-gray-600">المقاس: {device.size} بكسل</p>
                            </div>
                            {device.required && (
                              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                                مطلوب ✓
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <a
                              href={`https://via.placeholder.com/${device.size.replace(' × ', 'x')}.png?text=${encodeURIComponent(device.name)}`}
                              download={`${device.name.replace(/[^\w]/g, '_')}_${device.size.replace(' × ', 'x')}.png`}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              <Download className="w-4 h-4" />
                              تحميل قالب
                            </a>
                            <button
                              onClick={() => copyToClipboard(device.size, `size-${idx}-${deviceIdx}`)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            >
                              <Copy className="w-4 h-4" />
                              {copiedSection === `size-${idx}-${deviceIdx}` ? 'نُسخ!' : 'نسخ المقاس'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle>📐 كيفية إنشاء اللقطات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h4 className="font-bold mb-1">الطريقة 1: التصوير اليدوي</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>افتح الموقع على هاتفك أو محاكي iPhone</li>
                        <li>التقط صور بالمقاسات المطلوبة</li>
                        <li>استخدم أداة تحرير لتعديل المقاس</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">الطريقة 2: أدوات أونلاين</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>Shotsnapp:</strong> app.shotsnapp.com - لإضافة إطار iPhone</li>
                        <li><strong>Previewed:</strong> previewed.app - تصاميم احترافية</li>
                        <li><strong>Canva:</strong> canva.com - تصميم مخصص</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">الطريقة 3: Browser Developer Tools</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>افتح الموقع في Chrome/Firefox</li>
                        <li>اضغط F12 → Device Toolbar</li>
                        <li>اختر المقاس المطلوب</li>
                        <li>التقط Screenshot</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle>⚠️ ملاحظات مهمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    <li>احفظ الصور بصيغة <strong>PNG</strong> أو <strong>JPEG</strong></li>
                    <li>تأكد من وضوح النصوص والصور</li>
                    <li>اعرض أهم مميزات التطبيق</li>
                    <li>استخدم نفس اللغة في كل الصور (عربي أو إنجليزي)</li>
                    <li>لا تضع معلومات مضللة أو مبالغ فيها</li>
                    <li><strong>Apple:</strong> 3 لقطات على الأقل (الأفضل 5-6)</li>
                    <li><strong>Google Play:</strong> 2 لقطة على الأقل (الأفضل 4-8)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-xl mb-4 text-center">📧 تحتاج مساعدة؟</h3>
            <p className="text-center text-gray-700 mb-2">
              إذا واجهت أي مشكلة أثناء رفع التطبيق:
            </p>
            <p className="text-center">
              <a href="mailto:osakr100@gmail.com" className="text-green-600 hover:text-green-700 font-medium text-lg">
                osakr100@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}