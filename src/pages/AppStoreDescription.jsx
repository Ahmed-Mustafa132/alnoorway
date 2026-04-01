import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';

export default function AppStoreDescription() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ! / Copied!');
  };

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

  const keywords = `English: Islam, Islamic education, Quran, religious guidance, faith, Islamic knowledge, Muslim learning

Arabic: إسلام، تعليم إسلامي، قرآن، إرشاد ديني، إيمان، معرفة إسلامية، تعلم إسلامي`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">App Store Description</h1>

        {/* English Version */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>English Version</span>
              <button
                onClick={() => copyToClipboard(englishDescription)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
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

        {/* Arabic Version */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>النسخة العربية</span>
              <button
                onClick={() => copyToClipboard(arabicDescription)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Copy className="w-4 h-4" />
                نسخ
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

        {/* Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Keywords / الكلمات المفتاحية</span>
              <button
                onClick={() => copyToClipboard(keywords)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg text-sm">
              {keywords}
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 text-green-900">✅ Notes</h3>
            <ul className="list-disc list-inside text-green-800 space-y-2">
              <li>This description is factual and does not make exaggerated claims</li>
              <li>All features mentioned are actually available in the app</li>
              <li>No promises of results or benefits that cannot be verified</li>
              <li>Suitable for submission to Apple App Store</li>
              <li>Complies with App Store Review Guidelines</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}