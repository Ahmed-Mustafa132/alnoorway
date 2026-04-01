import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, CheckCircle } from 'lucide-react';

export default function AppReviewNotes() {
  const fullNotes = `# App Review Notes for Apple App Store Submission

Dear Apple App Review Team,

Thank you for reviewing our app. Below are important notes about our application to facilitate the review process:

## 1. App Architecture

**WebView-Based Application:**
- This app uses WKWebView to display content from our web platform
- The WebView loads content from: https://tarik-al-noor.base44.com
- This approach allows us to provide a consistent experience across platforms

**Why WebView:**
- Our platform is primarily a content delivery system
- Using WebView ensures content consistency and faster updates
- Users get the same reliable experience as our website

## 2. External Links Handling

**All external links open in the default browser (Safari):**
- We have implemented a custom link handler
- Any link to external domains automatically opens in Safari
- Users are never trapped inside the WebView
- This complies with Apple's guidelines on in-app browsing

**Test External Links:**
- Any YouTube links will open in Safari
- Any social media links will open in Safari
- Only internal navigation stays within the app

## 3. Service Worker - Important Note

**Service Worker is DISABLED in iOS WebView:**
- We detect iOS WebView using User-Agent
- Service Worker is completely disabled on iOS app
- This is done to comply with App Store requirements
- Service Worker only works on web browsers and Android

## 4. Privacy & Data Protection

**Privacy Policy:**
- Available in-app at: Settings → Privacy Policy
- Also available directly at: /p/PrivacyPolicy
- Clear explanation of data collection and usage

**Account Deletion:**
- Users can delete their account at: /p/DeleteAccount
- Deletion request form available without login required
- Account deletion processed within 7 business days
- All user data is permanently removed

**Data Collection:**
- We collect minimal data (email, name for registered users)
- No sensitive data is collected without user consent
- Users can use the app without creating an account

## 5. Content Guidelines Compliance

**Our Content:**
- Educational and informative Islamic content
- No medical advice or claims
- No financial promises
- All content is moderated
- No user-generated content without moderation

**Prohibited Content:**
- We do not allow hate speech
- We do not allow violence or explicit content
- All content complies with Apple's guidelines

## 6. App Permissions

**Internet Access:**
- Required to load content from our servers
- Users are informed that internet is required

**No Other Permissions:**
- We do not request location access
- We do not request camera or microphone
- We do not request contacts or photos
- We only use what's necessary for the app to function

## 7. In-App Purchases

**No In-App Purchases:**
- This app is completely free
- No subscriptions
- No paid content
- All content is accessible without payment

## 8. Testing Instructions

**Test Account (if needed):**
- Email: test@example.com
- Password: Not required - app works without login

**Main Features to Test:**
1. Browse content without login
2. Click external links (should open in Safari)
3. Navigate to Privacy Policy
4. Navigate to Delete Account page
5. Submit support request

**Expected Behavior:**
- App loads content smoothly
- External links open in Safari
- Internal navigation works within app
- All policies are accessible

## 9. Contact Information

**Developer Contact:**
- Email: osakr100@gmail.com
- Response time: Within 24 hours

**Support in App:**
- Support page available at: /p/Support
- Users can submit requests directly

## 10. Compliance Summary

✅ **Account Deletion:** Implemented and accessible
✅ **Privacy Policy:** Clear and accessible
✅ **Terms of Service:** Available
✅ **External Links:** Open in Safari
✅ **Service Worker:** Disabled on iOS
✅ **Data Collection:** Minimal and transparent
✅ **Content Guidelines:** All content moderated
✅ **No Misleading Claims:** Factual descriptions only

## 11. Platform Differences

**iOS-Specific Implementations:**
- Service Worker disabled (iOS only)
- External links open in Safari (iOS only)
- WebView detection for proper handling

**Other Platforms:**
- Web version: Full functionality
- Android: Standard WebView behavior
- No negative impact on other platforms

## 12. Updates & Maintenance

**Content Updates:**
- Content is updated server-side
- No app update needed for content changes
- Ensures users always see latest content

**Bug Fixes:**
- We respond quickly to any issues
- Regular updates for improvements
- User feedback is actively monitored

---

Thank you for your time. We appreciate your thorough review and are committed to maintaining the highest standards.

Contact: osakr100@gmail.com

Best regards,
Tariq Al-Noor Development Team

**Last Updated:** January 2026
**App Version:** 1.0.0`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ! / Copied!');
  };

  const sections = [
    { title: "App Architecture", emoji: "🏗️" },
    { title: "External Links Handling", emoji: "🔗" },
    { title: "Service Worker", emoji: "⚙️" },
    { title: "Privacy & Data Protection", emoji: "🔒" },
    { title: "Content Guidelines", emoji: "📝" },
    { title: "App Permissions", emoji: "🔐" },
    { title: "In-App Purchases", emoji: "💰" },
    { title: "Testing Instructions", emoji: "🧪" },
    { title: "Contact Information", emoji: "📧" },
    { title: "Compliance Summary", emoji: "✅" },
    { title: "Platform Differences", emoji: "📱" },
    { title: "Updates & Maintenance", emoji: "🔄" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">App Review Notes</h1>
          <p className="text-gray-600">For Apple App Store Submission</p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 Complete Review Notes</span>
              <button
                onClick={() => copyToClipboard(fullNotes)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Click the button above to copy all review notes to paste in App Store Connect.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-2xl">{section.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{section.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Text Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-6 rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto">
              {fullNotes}
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
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
              <div>
                <h3 className="font-bold mb-2 text-green-900">✅ Data Collection</h3>
                <p className="text-sm text-green-800">Minimal and transparent</p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-green-900">✅ No IAP</h3>
                <p className="text-sm text-green-800">Completely free app</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 text-yellow-900">📝 How to Use These Notes</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Copy the complete notes using the button above</li>
              <li>Go to App Store Connect → Your App → App Review Information</li>
              <li>Paste in the "Notes" field</li>
              <li>This helps reviewers understand your app quickly</li>
              <li>Reduces chances of rejection</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}