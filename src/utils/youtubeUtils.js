// ملف: src/utils/youtubeUtils.js

/**
 * استخراج معرف الفيديو من رابط اليوتيوب
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * الحصول على رابط الصورة المصغرة من اليوتيوب
 */
export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * التحقق من صحة رابط اليوتيوب
 */
export const isValidYouTubeUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};

/**
 * جلب بيانات الفيديو من YouTube oEmbed API
 * (بدون الحاجة لـ API Key!)
 */
export const fetchYouTubeVideoData = async (url) => {
  try {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('رابط يوتيوب غير صحيح');
    }

    // استخدام YouTube oEmbed API (مجاني وبدون API Key)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      throw new Error('فشل جلب بيانات الفيديو');
    }
    
    const data = await response.json();
    
    // تحضير البيانات بصيغة تناسب جدول Lecture
    return {
      title: data.title || '',
      speaker: data.author_name || '',
      description: '', // oEmbed لا يوفر الوصف
      url: url,
      thumbnail_url: data.thumbnail_url || getYouTubeThumbnail(url),
      type: 'video', // دائماً فيديو من اليوتيوب
      duration: '', // oEmbed لا يوفر المدة
      topic: '', // يحتاج ملء يدوي
      category: 'general', // افتراضي
      created_by: '',
      views_count: 0,
      likes_count: 0,
      shares_count: 0
    };
    
  } catch (error) {
    console.error('خطأ في جلب بيانات اليوتيوب:', error);
    throw error;
  }
};

/**
 * جلب بيانات الفيديو باستخدام YouTube Data API v3
 * (يحتاج API Key - أكثر تفصيلاً)
 */
export const fetchYouTubeVideoDataWithAPI = async (url, apiKey) => {
  try {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('رابط يوتيوب غير صحيح');
    }

    // استخدام YouTube Data API v3
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('فشل جلب بيانات الفيديو');
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('لم يتم العثور على الفيديو');
    }
    
    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    const statistics = video.statistics;
    
    // تحويل مدة ISO 8601 إلى صيغة قابلة للقراءة
    const duration = parseDuration(contentDetails.duration);
    
    return {
      title: snippet.title || '',
      speaker: snippet.channelTitle || '',
      description: snippet.description || '',
      url: url,
      thumbnail_url: snippet.thumbnails?.high?.url || getYouTubeThumbnail(url),
      type: 'video',
      duration: duration,
      topic: snippet.tags?.join(', ') || '',
      category: 'general',
      created_by: snippet.channelTitle || '',
      views_count: parseInt(statistics.viewCount) || 0,
      likes_count: parseInt(statistics.likeCount) || 0,
      shares_count: 0
    };
    
  } catch (error) {
    console.error('خطأ في جلب بيانات اليوتيوب:', error);
    throw error;
  }
};

/**
 * تحويل مدة ISO 8601 إلى صيغة قابلة للقراءة
 * مثال: PT1H30M15S → 1:30:15
 */
function parseDuration(duration) {
  if (!duration) return '';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * جلب بيانات متعددة للفيديوهات دفعة واحدة
 */
export const fetchMultipleYouTubeVideos = async (urls) => {
  const promises = urls.map(url => fetchYouTubeVideoData(url));
  return await Promise.all(promises);
};
