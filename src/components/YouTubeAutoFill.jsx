import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle, AlertCircle, Youtube } from "lucide-react";
import { fetchYouTubeVideoData, isValidYouTubeUrl } from "@/utils/youtubeUtils";

export default function YouTubeAutoFill({ onDataFetched }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAutoFill = async () => {
    if (!youtubeUrl.trim()) {
      setError("الرجاء إدخال رابط يوتيوب");
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      setError("رابط يوتيوب غير صحيح");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await fetchYouTubeVideoData(youtubeUrl);
      
      if (onDataFetched) {
        onDataFetched({
          title: data.title,
          speaker: data.speaker,
          description: data.description || "",
          url: youtubeUrl,
          type: "video",
          category: "general",
          topic: data.topic || "",
          duration: data.duration || "",
        });
      }

      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setYoutubeUrl("");
      }, 3000);

    } catch (err) {
      setError("فشل جلب بيانات الفيديو. تأكد من الرابط وحاول مرة أخرى.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAutoFill();
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 mb-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Youtube className="w-5 h-5" />
          <h3 className="font-bold text-sm">ملء تلقائي من اليوتيوب</h3>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube-url" className="text-xs text-gray-700 dark:text-gray-300">
            الصق رابط اليوتيوب هنا:
          </Label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              disabled={loading}
            />
            <Button
              onClick={handleAutoFill}
              disabled={loading || !youtubeUrl.trim()}
              size="sm"
              type="button"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جلب...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 ml-2" />
                  ملء تلقائي
                </>
              )}
            </Button>
          </div>
        </div>

        {/* رسائل النجاح والخطأ */}
        {success && (
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded-lg text-xs">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>تم ملء الحقول تلقائياً! يمكنك التعديل عليها إذا أردت.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-2 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>💡 <strong>نصيحة:</strong> الملء التلقائي يوفر لك الوقت!</p>
          <p className="text-[10px]">
            ✅ مجاني 100% | ✅ يملأ: العنوان، المحاضر، الرابط، الصورة
          </p>
        </div>
      </CardContent>
    </Card>
  );
}