export default {
  "User": {
    "name": "User",
    "type": "object",
    "properties": {
      "full_name": { "type": "string" },
      "email": { "type": "string" },
      "role": {
        "type": "string",
        "enum": ["user", "moderator", "admin"],
        "default": "user"
      },
      "is_active": {
        "type": "boolean",
        "default": true,
        "description": "حالة الحساب"
      },
      "id": { "type": "string", "format": "uuid", "description": "Auto-generated ID" },
      "created_date": { "type": "string", "format": "date-time" },
      "updated_date": { "type": "string", "format": "date-time" }
    },
    "required": ["email"]
  },
  "Article": {
    "name": "Article",
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "عنوان المقال" },
      "content": { "type": "string", "description": "محتوى المقال" },
      "author": { "type": "string", "description": "كاتب المقال" },
      "tags": { "type": "array", "items": { "type": "string" }, "description": "الكلمات المفتاحية" },
      "meta_description": { "type": "string", "description": "وصف الميتا لمحركات البحث" },
      "image_url": { "type": "string", "description": "صورة المقال" },
      "category": { "type": "string", "description": "تصنيف المقال" },
      "is_published": { "type": "boolean", "default": false, "description": "هل المقال منشور" },
      "language": { "type": "string", "enum": ["ar", "en", "fr", "ur"], "default": "ar", "description": "لغة المقال" }
    },
    "required": ["title", "content"]
  },
  "CourseEnrollment": {
    "name": "CourseEnrollment",
    "type": "object",
    "properties": {
      "course_id": { "type": "string", "description": "معرف الدورة" },
      "user_email": { "type": "string", "description": "البريد الإلكتروني للطالب" },
      "user_name": { "type": "string", "description": "اسم الطالب" },
      "phone": { "type": "string", "description": "رقم الهاتف" },
      "gender": { "type": "string", "enum": ["male", "female"], "description": "الجنس" },
      "status": { "type": "string", "enum": ["pending", "approved", "rejected", "completed"], "default": "pending", "description": "حالة التسجيل" },
      "progress": { "type": "number", "default": 0, "description": "نسبة التقدم %" },
      "completed_lessons": { "type": "array", "items": { "type": "string" }, "description": "الدروس المكتملة" },
      "notes": { "type": "string", "description": "ملاحظات" },
      "id": { "type": "string", "format": "uuid" },
      "created_date": { "type": "string", "format": "date-time" }
    },
    "required": ["course_id", "user_email", "user_name", "gender"]
  },
  "Book": {
    "name": "Book",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "author": { "type": "string" },
      "description": { "type": "string" },
      "category": { "type": "string", "enum": ["hadith", "tafsir", "fiqh", "azkar", "seerah", "general"] },
      "pages": { "type": "number" },
      "cover_url": { "type": "string" },
      "pdf_url": { "type": "string" },
      "content": { "type": "string" },
      "language": { "type": "string", "default": "ar" }
    },
    "required": ["title", "author", "category"]
  },
  "QuranCourse": {
    "name": "QuranCourse",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "teacher_name": { "type": "string" },
      "description": { "type": "string" },
      "type": { "type": "string", "enum": ["memorization", "recitation", "tajweed"] },
      "gender": { "type": "string", "enum": ["male", "female"] },
      "level": { "type": "string", "enum": ["beginner", "intermediate", "advanced"] },
      "schedule": { "type": "string" },
      "duration": { "type": "string" },
      "max_students": { "type": "number" },
      "current_students": { "type": "number", "default": 0 },
      "google_meet_link": { "type": "string" },
      "is_active": { "type": "boolean", "default": true },
      "start_date": { "type": "string", "format": "date" }
    },
    "required": ["title", "teacher_name", "type", "gender"]
  },
  "Lecture": {
    "name": "Lecture",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "speaker": { "type": "string" },
      "description": { "type": "string" },
      "type": { "type": "string", "enum": ["audio", "video"] },
      "category": { "type": "string", "enum": ["learn_islam", "repentance", "general"] },
      "topic": { "type": "string" },
      "url": { "type": "string" },
      "duration": { "type": "string" },
      "thumbnail_url": { "type": "string" },
      "views_count": { "type": "number", "default": 0 },
      "likes_count": { "type": "number", "default": 0 },
      "shares_count": { "type": "number", "default": 0 }
    },
    "required": ["title", "speaker", "type", "category"]
  },
  "Fatwa": {
    "name": "Fatwa",
    "type": "object",
    "properties": {
      "question": { "type": "string" },
      "answer": { "type": "string" },
      "mufti": { "type": "string" },
      "category": { "type": "string" },
      "tags": { "type": "array", "items": { "type": "string" } },
      "reference": { "type": "string" }
    },
    "required": ["question", "answer", "category"]
  },
  "Story": {
    "name": "Story",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "author": { "type": "string" },
      "content": { "type": "string" },
      "category": { "type": "string", "enum": ["convert", "repentance"] },
      "excerpt": { "type": "string" },
      "image_url": { "type": "string" },
      "country": { "type": "string" }
    },
    "required": ["title", "content", "category"]
  },
  "LiveStream": {
    "name": "LiveStream",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "description": { "type": "string" },
      "speaker": { "type": "string" },
      "category": { "type": "string", "enum": ["lecture", "quran_class", "qa_session", "special_event"] },
      "scheduled_time": { "type": "string", "format": "date-time" },
      "stream_url": { "type": "string" },
      "is_live": { "type": "boolean", "default": false },
      "thumbnail_url": { "type": "string" },
      "viewers_count": { "type": "number", "default": 0 },
      "recording_url": { "type": "string" },
      "chat_enabled": { "type": "boolean", "default": true },
      "language": { "type": "string", "default": "ar" },
      "notification_sent": { "type": "boolean", "default": false },
      "reminder_sent": { "type": "boolean", "default": false }
    },
    "required": ["title", "speaker", "category", "scheduled_time"]
  },
  "Scholar": {
    "name": "Scholar",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "type": { "type": "string", "enum": ["mufti", "preacher", "scholar", "teacher"] },
      "specialization": { "type": "string", "enum": ["fiqh", "hadith", "tafsir", "aqeedah", "quran", "general"] },
      "gender": { "type": "string", "enum": ["male", "female"] },
      "languages": { "type": "array", "items": { "type": "string" } },
      "phone": { "type": "string" },
      "whatsapp": { "type": "string" },
      "email": { "type": "string" },
      "google_meet_link": { "type": "string" },
      "country": { "type": "string" },
      "bio": { "type": "string" },
      "is_available": { "type": "boolean", "default": true }
    },
    "required": ["name", "type"]
  },
  "Comment": {
    "name": "Comment",
    "type": "object",
    "properties": {
      "user_name": { "type": "string" },
      "user_email": { "type": "string" },
      "content_type": { "type": "string", "enum": ["lecture", "story", "fatwa", "book"] },
      "content_id": { "type": "string" },
      "comment_text": { "type": "string" },
      "parent_comment_id": { "type": "string" },
      "is_approved": { "type": "boolean", "default": true },
      "likes_count": { "type": "number", "default": 0 }
    },
    "required": ["user_name", "user_email", "content_type", "content_id", "comment_text"]
  },
  "Rating": {
    "name": "Rating",
    "type": "object",
    "properties": {
      "user_email": { "type": "string" },
      "content_type": { "type": "string", "enum": ["lecture", "story", "fatwa", "book"] },
      "content_id": { "type": "string" },
      "rating": { "type": "number", "minimum": 1, "maximum": 5 },
      "review": { "type": "string" }
    },
    "required": ["user_email", "content_type", "content_id", "rating"]
  },
  "Notification": {
    "name": "Notification",
    "type": "object",
    "properties": {
      "user_email": { "type": "string" },
      "title": { "type": "string" },
      "message": { "type": "string" },
      "type": { "type": "string", "enum": ["live_stream", "new_content", "comment_reply", "general"] },
      "link": { "type": "string" },
      "is_read": { "type": "boolean", "default": false },
      "icon": { "type": "string" }
    },
    "required": ["user_email", "title", "message", "type"]
  },
  "ReconciliationCommittee": {
    "name": "ReconciliationCommittee",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "title": { "type": "string" },
      "position": { "type": "string" },
      "photo_url": { "type": "string" },
      "specialization": { "type": "array", "items": { "type": "string" } },
      "qualifications": { "type": "array", "items": { "type": "string" } },
      "experience_years": { "type": "number" },
      "bio": { "type": "string" },
      "achievements": { "type": "array", "items": { "type": "string" } },
      "contact_email": { "type": "string" },
      "contact_phone": { "type": "string" },
      "is_active": { "type": "boolean", "default": true },
      "order": { "type": "number" }
    },
    "required": ["name", "title", "position"]
  },
  "ReconciliationRequest": {
    "name": "ReconciliationRequest",
    "type": "object",
    "properties": {
      "requester_name": { "type": "string" },
      "requester_email": { "type": "string" },
      "requester_phone": { "type": "string" },
      "conflict_type": { "type": "string" },
      "conflict_description": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ["pending", "under_review", "scheduled", "in_progress", "resolved", "rejected"],
        "default": "pending"
      },
      "meeting_date": { "type": "string", "format": "date-time" },
      "meeting_link": { "type": "string" },
      "notes_from_committee": { "type": "string" }
    }
  },
  "Favorite": {
    "name": "Favorite",
    "type": "object",
    "properties": {
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "item_type": { "type": "string", "enum": ["lecture", "story", "fatwa"], "description": "نوع المحتوى المفضل" },
      "item_id": { "type": "string", "description": "معرّف العنصر المفضل" },
      "item_title": { "type": "string", "description": "عنوان العنصر" },
      "item_data": { "type": "object", "description": "بيانات العنصر الكاملة" }
    },
    "required": ["user_email", "item_type", "item_id"]
  },
  "Course": {
    "name": "Course",
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "عنوان الدورة" },
      "instructor": { "type": "string", "description": "اسم المدرب/الشيخ" },
      "description": { "type": "string", "description": "وصف الدورة" },
      "category": { "type": "string", "enum": ["aqeedah", "fiqh", "hadith", "tafsir", "general"], "description": "التصنيف" },
      "level": { "type": "string", "enum": ["beginner", "intermediate", "advanced"], "description": "المستوى" },
      "thumbnail_url": { "type": "string", "description": "صورة الغلاف" },
      "is_published": { "type": "boolean", "default": false, "description": "هل الدورة منشورة" }
    },
    "required": ["title", "instructor", "category"]
  },
  "CourseModule": {
    "name": "CourseModule",
    "type": "object",
    "properties": {
      "course_id": { "type": "string", "description": "معرف الدورة" },
      "title": { "type": "string", "description": "عنوان الوحدة" },
      "order": { "type": "number", "description": "ترتيب الوحدة" }
    },
    "required": ["course_id", "title"]
  },
  "CourseLesson": {
    "name": "CourseLesson",
    "type": "object",
    "properties": {
      "module_id": { "type": "string", "description": "معرف الوحدة" },
      "title": { "type": "string", "description": "عنوان الدرس" },
      "content_type": { "type": "string", "enum": ["video", "text", "audio"], "description": "نوع المحتوى" },
      "video_url": { "type": "string", "description": "رابط الفيديو" },
      "text_content": { "type": "string", "description": "محتوى نصي" },
      "attachment_url": { "type": "string", "description": "ملف مرفق" },
      "order": { "type": "number", "description": "ترتيب الدرس" },
      "duration": { "type": "string", "description": "مدة الدرس" }
    },
    "required": ["module_id", "title", "content_type"]
  },
  "UserCourseProgress": {
    "name": "UserCourseProgress",
    "type": "object",
    "properties": {
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "course_id": { "type": "string", "description": "معرف الدورة" },
      "completed_lessons": { "type": "array", "items": { "type": "string" }, "description": "الدروس المكتملة" },
      "is_completed": { "type": "boolean", "default": false, "description": "هل أتم الدورة" },
      "completion_date": { "type": "string", "format": "date-time", "description": "تاريخ الإتمام" }
    },
    "required": ["user_email", "course_id"]
  },
  "Appointment": {
    "name": "Appointment",
    "type": "object",
    "properties": {
      "scholar_email": { "type": "string", "description": "بريد الشيخ/الداعية" },
      "scholar_name": { "type": "string", "description": "اسم الشيخ/الداعية" },
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "user_name": { "type": "string", "description": "اسم المستخدم" },
      "scheduled_time": { "type": "string", "format": "date-time", "description": "وقت الموعد المقترح" },
      "status": { "type": "string", "enum": ["pending", "confirmed", "completed", "cancelled"], "default": "pending", "description": "حالة الموعد" },
      "meeting_link": { "type": "string", "description": "رابط اللقاء (Google Meet/Zoom)" },
      "notes": { "type": "string", "description": "ملاحظات إضافية" }
    },
    "required": ["scholar_email", "user_email", "scheduled_time"]
  },
  "IslamicCenter": {
    "name": "IslamicCenter",
    "type": "object",
    "properties": {
      "name": { "type": "string", "description": "اسم المركز" },
      "address": { "type": "string", "description": "العنوان" },
      "city": { "type": "string", "description": "المدينة" },
      "country": { "type": "string", "description": "الدولة" },
      "phone": { "type": "string", "description": "رقم الهاتف" },
      "email": { "type": "string", "description": "البريد الإلكتروني" },
      "description": { "type": "string", "description": "وصف المركز" },
      "services": { "type": "array", "items": { "type": "string" }, "description": "الخدمات المقدمة" },
      "latitude": { "type": "number", "description": "خط العرض" },
      "longitude": { "type": "number", "description": "خط الطول" }
    },
    "required": ["name", "city", "country"]
  },
  "UserPreference": {
    "name": "UserPreference",
    "type": "object",
    "properties": {
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "interested_topics": { "type": "array", "items": { "type": "string", "enum": ["quran", "hadith", "fiqh", "tafsir", "aqeedah", "seerah", "azkar", "repentance"] }, "description": "المواضيع المفضلة للمستخدم" },
      "view_history": { "type": "array", "items": { "type": "object", "properties": { "content_type": { "type": "string", "enum": ["lecture", "book", "fatwa", "story"] }, "content_id": { "type": "string" }, "viewed_at": { "type": "string", "format": "date-time" } } }, "description": "سجل المشاهدات" },
      "search_history": { "type": "array", "items": { "type": "string" }, "description": "سجل البحث" },
      "preferred_speakers": { "type": "array", "items": { "type": "string" }, "description": "الدعاة والشيوخ المفضلين" },
      "notification_preferences": { "type": "object", "properties": { "new_content": { "type": "boolean", "default": true }, "live_streams": { "type": "boolean", "default": true }, "fatwa_answers": { "type": "boolean", "default": true }, "scheduled_meetings": { "type": "boolean", "default": true } } }
    },
    "required": ["user_email"]
  },
  "AnalyticsEvent": {
    "name": "AnalyticsEvent",
    "type": "object",
    "properties": {
      "event_type": { "type": "string", "enum": ["view", "search", "download", "share", "like", "comment", "enroll", "request"], "description": "نوع الحدث" },
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "content_type": { "type": "string", "enum": ["lecture", "book", "fatwa", "story", "course", "live_stream"], "description": "نوع المحتوى" },
      "content_id": { "type": "string", "description": "معرّف المحتوى" },
      "search_query": { "type": "string", "description": "نص البحث" },
      "metadata": { "type": "object", "description": "بيانات إضافية" },
      "user_country": { "type": "string", "description": "دولة المستخدم" },
      "user_language": { "type": "string", "description": "لغة المستخدم" },
      "device_type": { "type": "string", "enum": ["mobile", "tablet", "desktop"], "description": "نوع الجهاز" }
    },
    "required": ["event_type"]
  },
  "Conversation": {
    "name": "Conversation",
    "type": "object",
    "properties": {
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "user_name": { "type": "string", "description": "اسم المستخدم" },
      "scholar_email": { "type": "string", "description": "بريد الشيخ/الداعية/المحفظ" },
      "scholar_name": { "type": "string", "description": "اسم الشيخ/الداعية/المحفظ" },
      "scholar_type": { "type": "string", "enum": ["mufti", "preacher", "teacher"], "description": "نوع العالم" },
      "last_message": { "type": "string", "description": "آخر رسالة" },
      "last_message_time": { "type": "string", "format": "date-time", "description": "وقت آخر رسالة" },
      "unread_count_user": { "type": "number", "default": 0, "description": "عدد الرسائل غير المقروءة للمستخدم" },
      "unread_count_scholar": { "type": "number", "default": 0, "description": "عدد الرسائل غير المقروءة للشيخ" },
      "status": { "type": "string", "enum": ["active", "archived", "blocked"], "default": "active", "description": "حالة المحادثة" }
    },
    "required": ["user_email", "user_name", "scholar_email", "scholar_name", "scholar_type"]
  },
  "ChatMessage": {
    "name": "ChatMessage",
    "type": "object",
    "properties": {
      "conversation_id": { "type": "string", "description": "معرف المحادثة" },
      "sender_email": { "type": "string", "description": "بريد المرسل" },
      "sender_name": { "type": "string", "description": "اسم المرسل" },
      "sender_type": { "type": "string", "enum": ["user", "scholar"], "description": "نوع المرسل" },
      "receiver_email": { "type": "string", "description": "بريد المستقبل" },
      "receiver_name": { "type": "string", "description": "اسم المستقبل" },
      "message_text": { "type": "string", "description": "نص الرسالة" },
      "is_read": { "type": "boolean", "default": false, "description": "هل تم قراءة الرسالة" },
      "attachment_url": { "type": "string", "description": "رابط المرفق إن وجد" }
    },
    "required": ["conversation_id", "sender_email", "sender_name", "sender_type", "receiver_email", "message_text"]
  },
  "ContentRecommendation": {
    "name": "ContentRecommendation",
    "type": "object",
    "properties": {
      "user_email": { "type": "string", "description": "بريد المستخدم" },
      "content_type": { "type": "string", "enum": ["lecture", "book", "fatwa", "story"], "description": "نوع المحتوى" },
      "content_id": { "type": "string", "description": "معرّف المحتوى" },
      "recommendation_score": { "type": "number", "description": "درجة التوصية (0-100)" },
      "recommendation_reason": { "type": "string", "description": "سبب التوصية" },
      "based_on": { "type": "array", "items": { "type": "string" }, "description": "المحتوى الذي بنيت عليه التوصية" }
    },
    "required": ["user_email", "content_type", "content_id", "recommendation_score"]
  },
  "FatwaRequest": {
    "name": "FatwaRequest",
    "type": "object",
    "properties": {
      "name": { "type": "string", "description": "الاسم" },
      "email": { "type": "string", "description": "البريد الإلكتروني" },
      "question": { "type": "string", "description": "السؤال الشرعي" },
      "category": { "type": "string", "description": "تصنيف السؤال" },
      "status": { "type": "string", "enum": ["pending", "answered", "in_progress"], "default": "pending", "description": "حالة الطلب" },
      "answer": { "type": "string", "description": "الجواب" },
      "answered_by": { "type": "string", "description": "المفتي الذي أجاب" }
    },
    "required": ["name", "email", "question"]
  },
  "ContactRequest": {
    "name": "ContactRequest",
    "type": "object",
    "properties": {
      "name": { "type": "string", "description": "الاسم" },
      "email": { "type": "string", "description": "البريد الإلكتروني" },
      "phone": { "type": "string", "description": "رقم الهاتف" },
      "request_type": { "type": "string", "enum": ["التعرف على الإسلام", "التوبة", "فتوى"], "description": "نوع الطلب" },
      "message": { "type": "string", "description": "الرسالة" },
      "preferred_contact_method": { "type": "string", "enum": ["البريد الإلكتروني", "الهاتف", "واتساب"], "description": "طريقة التواصل المفضلة" },
      "status": { "type": "string", "enum": ["معلق", "تم التواصل", "مكتمل"], "default": "معلق", "description": "حالة الطلب" }
    },
    "required": ["name", "email", "request_type", "message"]
  },
  "JoinTeamRequest": {
    "name": "JoinTeamRequest",
    "type": "object",
    "properties": {
      "role_type": { "type": "string", "enum": ["mufti", "preacher", "islamic_center"], "description": "نوع الدور" },
      "full_name": { "type": "string", "description": "الاسم الكامل" },
      "age": { "type": "number", "description": "السن" },
      "address": { "type": "string", "description": "العنوان" },
      "country": { "type": "string", "description": "البلد" },
      "languages": { "type": "array", "items": { "type": "string" }, "description": "اللغات" },
      "qualification": { "type": "string", "description": "المؤهل" },
      "courses": { "type": "string", "description": "الدورات الحاصل عليها" },
      "phone": { "type": "string", "description": "رقم الهاتف" },
      "email": { "type": "string", "description": "البريد الإلكتروني" },
      "whatsapp": { "type": "string", "description": "رقم الواتساب" },
      "status": { "type": "string", "enum": ["pending", "approved", "rejected"], "default": "pending", "description": "حالة الطلب" }
    },
    "required": ["role_type", "full_name", "country", "email"]
  }
};