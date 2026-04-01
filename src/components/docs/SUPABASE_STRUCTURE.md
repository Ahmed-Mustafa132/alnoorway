# Supabase Database Structure - AlNourway

## نظرة عامة

هذا المستند يشرح بنية قاعدة البيانات في **Supabase (PostgreSQL)** المستخدمة حالياً في مشروع طريق النور.

---

## 📊 قائمة الجداول (35 جدول)

### 🔐 **1. Profile** (ملفات المستخدمين)
**الوصف:** بيانات المستخدمين وصلاحياتهم
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- name: TEXT
- email: TEXT (Unique)
- role: TEXT (admin | moderator | user)
- avatar_url: TEXT
- bio: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**RLS Policy:**
- Users: قراءة ملفهم فقط
- Admin: قراءة وتعديل الكل
- Moderator: قراءة الكل فقط

---

### 📚 **2. Book** (الكتب)
**الوصف:** مكتبة الكتب الإسلامية
```sql
- id: UUID (Primary Key)
- title: TEXT
- author: TEXT
- description: TEXT
- category: TEXT (hadith | tafsir | fiqh | azkar | seerah | general)
- pages: INTEGER
- cover_url: TEXT
- pdf_url: TEXT
- content: TEXT
- language: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🎥 **3. Lecture** (المحاضرات)
**الوصف:** محاضرات صوتية ومرئية
```sql
- id: UUID (Primary Key)
- title: TEXT
- speaker: TEXT
- description: TEXT
- type: TEXT (audio | video)
- category: TEXT (learn_islam | repentance | general)
- topic: TEXT
- url: TEXT
- duration: TEXT
- thumbnail_url: TEXT
- views_count: INTEGER (Default: 0)
- likes_count: INTEGER (Default: 0)
- shares_count: INTEGER (Default: 0)
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

**Indexes:**
- `idx_lecture_category` على `category`
- `idx_lecture_views` على `views_count DESC`

---

### 💬 **4. Fatwa** (الفتاوى)
**الوصف:** فتاوى شرعية من علماء موثوقين
```sql
- id: UUID (Primary Key)
- question: TEXT
- answer: TEXT
- mufti: TEXT
- category: TEXT
- tags: TEXT[]
- reference: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### ❤️ **5. Story** (القصص)
**الوصف:** قصص التوبة والاهتداء
```sql
- id: UUID (Primary Key)
- title: TEXT
- author: TEXT
- content: TEXT
- category: TEXT (convert | repentance)
- excerpt: TEXT
- image_url: TEXT
- country: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🎓 **6. Scholar** (العلماء والدعاة)
**الوصف:** قاعدة بيانات العلماء والمحفظين
```sql
- id: UUID (Primary Key)
- name: TEXT
- type: TEXT (mufti | preacher | scholar | teacher)
- specialization: TEXT (fiqh | hadith | tafsir | aqeedah | quran | general)
- gender: TEXT (male | female)
- languages: TEXT[]
- phone: TEXT
- whatsapp: TEXT
- email: TEXT
- google_meet_link: TEXT
- country: TEXT
- bio: TEXT
- is_available: BOOLEAN (Default: true)
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🏢 **7. IslamicCenter** (المراكز الإسلامية)
**الوصف:** مراكز الدعوة والتعليم
```sql
- id: UUID (Primary Key)
- name: TEXT
- city: TEXT
- country: TEXT
- address: TEXT
- phone: TEXT
- email: TEXT
- description: TEXT
- services: TEXT[]
- latitude: FLOAT
- longitude: FLOAT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 📖 **8. QuranCourse** (دورات القرآن)
**الوصف:** دورات حفظ وتجويد القرآن
```sql
- id: UUID (Primary Key)
- title: TEXT
- teacher_name: TEXT
- description: TEXT
- type: TEXT (memorization | recitation | tajweed)
- gender: TEXT (male | female)
- level: TEXT (beginner | intermediate | advanced)
- schedule: TEXT
- duration: TEXT
- max_students: INTEGER
- current_students: INTEGER (Default: 0)
- google_meet_link: TEXT
- is_active: BOOLEAN (Default: true)
- start_date: DATE
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 📺 **9. LiveStream** (البث المباشر)
**الوصف:** جدول البثوث المباشرة
```sql
- id: UUID (Primary Key)
- title: TEXT
- speaker: TEXT
- description: TEXT
- category: TEXT (lecture | quran_class | qa_session | special_event)
- scheduled_time: TIMESTAMPTZ
- stream_url: TEXT
- thumbnail_url: TEXT
- is_live: BOOLEAN (Default: false)
- viewers_count: INTEGER (Default: 0)
- chat_enabled: BOOLEAN (Default: true)
- language: TEXT (Default: 'ar')
- recording_url: TEXT
- notification_sent: BOOLEAN (Default: false)
- reminder_sent: BOOLEAN (Default: false)
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

**Indexes:**
- `idx_livestream_scheduled` على `scheduled_time`
- `idx_livestream_is_live` على `is_live`

---

### 💭 **10. Comment** (التعليقات)
**الوصف:** تعليقات المستخدمين على المحتوى
```sql
- id: UUID (Primary Key)
- user_name: TEXT
- user_email: TEXT
- content_type: TEXT (lecture | book | story | fatwa)
- content_id: TEXT
- comment_text: TEXT
- parent_comment_id: UUID (NULL للتعليقات الرئيسية)
- is_approved: BOOLEAN (Default: false)
- likes_count: INTEGER (Default: 0)
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

**Check Constraints:**
- `content_type` IN ('lecture', 'book', 'story', 'fatwa')

---

### ⭐ **11. Rating** (التقييمات)
**الوصف:** تقييمات المحتوى من 1-5
```sql
- id: UUID (Primary Key)
- user_email: TEXT
- content_type: TEXT (lecture | book | story | fatwa)
- content_id: TEXT
- rating: INTEGER (1-5)
- review: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

**Check Constraints:**
- `rating` BETWEEN 1 AND 5
- `content_type` IN ('lecture', 'book', 'story', 'fatwa')

---

### 📝 **12. FatwaRequest** (طلبات الفتوى)
**الوصف:** أسئلة المستخدمين الشرعية
```sql
- id: UUID (Primary Key)
- name: TEXT
- email: TEXT
- question: TEXT
- category: TEXT
- status: TEXT (pending | answered)
- answer: TEXT
- answered_by: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🔔 **13. Notification** (الإشعارات)
**الوصف:** إشعارات المستخدمين
```sql
- id: UUID (Primary Key)
- user_email: TEXT
- message: TEXT
- type: TEXT (fatwa_answer | new_content | live_stream | general)
- is_read: BOOLEAN (Default: false)
- target_url: TEXT
- created_date: TIMESTAMPTZ
```

**Indexes:**
- `idx_notification_user_email` على `user_email`
- `idx_notification_is_read` على `is_read`

---

### ❤️ **14. Favorite** (المفضلة)
**الوصف:** محتوى محفوظ من المستخدمين
```sql
- id: UUID (Primary Key)
- user_email: TEXT
- item_type: TEXT
- item_id: TEXT
- item_title: TEXT
- item_data: JSONB
- created_date: TIMESTAMPTZ
```

---

### 📊 **15. AnalyticsEvent** (أحداث التحليلات)
**الوصف:** تتبع تفاعل المستخدمين
```sql
- id: UUID (Primary Key)
- user_email: TEXT
- event_type: TEXT (view | search | download | share | like | comment | enroll | request)
- content_type: TEXT (lecture | book | fatwa | story | course | live_stream | query)
- content_id: TEXT
- additional_data: JSONB
- device_type: TEXT (mobile | tablet | desktop)
- created_date: TIMESTAMPTZ
```

**Check Constraints:**
- `event_type` IN (...)
- `content_type` IN (...)
- `device_type` IN ('mobile', 'tablet', 'desktop')

---

### 👥 **16. ReconciliationCommittee** (لجنة الإصلاح)
**الوصف:** أعضاء لجنة إصلاح ذات البين
```sql
- id: UUID (Primary Key)
- name: TEXT
- title: TEXT
- position: TEXT
- photo_url: TEXT
- bio: TEXT
- experience_years: INTEGER
- contact_email: TEXT
- contact_phone: TEXT
- is_active: BOOLEAN (Default: true)
- order: INTEGER
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🤝 **17. ReconciliationRequest** (طلبات الإصلاح)
**الوصف:** طلبات المصالحة بين المتنازعين
```sql
- id: UUID (Primary Key)
- requester_name: TEXT
- requester_email: TEXT
- requester_phone: TEXT
- conflict_type: TEXT
- conflict_description: TEXT
- status: TEXT (pending | under_review | scheduled | in_progress | resolved | rejected)
- meeting_date: TIMESTAMPTZ
- meeting_link: TEXT
- notes_from_committee: TEXT
- created_date: TIMESTAMPTZ
- updated_date: TIMESTAMPTZ
```

---

### 🎓 **18-22. نظام الدورات التعليمية**

#### **18. Course** (الدورات)
```sql
- id: UUID
- title: TEXT
- instructor: TEXT
- description: TEXT
- category: TEXT (aqeedah | fiqh | hadith | tafsir | general)
- level: TEXT (beginner | intermediate | advanced)
- thumbnail_url: TEXT
- is_published: BOOLEAN
- created_date: TIMESTAMPTZ
```

#### **19. CourseModule** (وحدات الدورات)
```sql
- id: UUID
- course_id: UUID (FK → Course)
- title: TEXT
- order: INTEGER
- created_date: TIMESTAMPTZ
```

#### **20. CourseLesson** (دروس الدورات)
```sql
- id: UUID
- module_id: UUID (FK → CourseModule)
- title: TEXT
- content_type: TEXT (video | text | audio)
- video_url: TEXT
- text_content: TEXT
- attachment_url: TEXT
- duration: TEXT
- order: INTEGER
- created_date: TIMESTAMPTZ
```

#### **21. CourseEnrollment** (التسجيل في الدورات)
```sql
- id: UUID
- course_id: UUID (FK → Course)
- user_email: TEXT
- status: TEXT (active | completed | dropped)
- progress_percentage: INTEGER
- enrolled_date: TIMESTAMPTZ
```

#### **22. CourseProgress** (تقدم الطلاب)
```sql
- id: UUID
- enrollment_id: UUID (FK → CourseEnrollment)
- lesson_id: UUID (FK → CourseLesson)
- completed: BOOLEAN
- completed_date: TIMESTAMPTZ
```

---

## 🔗 العلاقات بين الجداول

### Foreign Keys الرئيسية:
```sql
Profile.user_id → auth.users.id
CourseModule.course_id → Course.id
CourseLesson.module_id → CourseModule.id
CourseEnrollment.course_id → Course.id
CourseProgress.enrollment_id → CourseEnrollment.id
CourseProgress.lesson_id → CourseLesson.id
Comment.parent_comment_id → Comment.id (Self-Reference)
```

### Polymorphic Relationships:
```sql
Comment.content_type + content_id → (Lecture | Book | Story | Fatwa)
Rating.content_type + content_id → (Lecture | Book | Story | Fatwa)
Favorite.item_type + item_id → أي محتوى
AnalyticsEvent.content_type + content_id → أي محتوى
```

---

## 🔒 Row Level Security (RLS)

جميع الجداول محمية بـ RLS Policies:

### مثال: Profile Table
```sql
-- Users: قراءة ملفهم فقط
CREATE POLICY "Users can view own profile"
ON "Profile" FOR SELECT
USING (auth.uid() = user_id);

-- Admin: الوصول الكامل
CREATE POLICY "Admin full access"
ON "Profile" FOR ALL
USING ((SELECT role FROM "Profile" WHERE user_id = auth.uid()) = 'admin');
```

---

## 📈 الأداء والفهرسة

### Indexes الرئيسية:
```sql
-- Profile
CREATE INDEX idx_profile_email ON "Profile"(email);
CREATE INDEX idx_profile_role ON "Profile"(role);

-- Lecture
CREATE INDEX idx_lecture_category ON "Lecture"(category);
CREATE INDEX idx_lecture_views ON "Lecture"(views_count DESC);
CREATE INDEX idx_lecture_created ON "Lecture"(created_date DESC);

-- LiveStream
CREATE INDEX idx_livestream_scheduled ON "LiveStream"(scheduled_time);
CREATE INDEX idx_livestream_is_live ON "LiveStream"(is_live);

-- Comment
CREATE INDEX idx_comment_content ON "Comment"(content_type, content_id);
CREATE INDEX idx_comment_approved ON "Comment"(is_approved);

-- Notification
CREATE INDEX idx_notification_user ON "Notification"(user_email);
CREATE INDEX idx_notification_read ON "Notification"(is_read);
```

---

## 🔧 Database Functions & Triggers

### 1. Auto Profile Creation
```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profile" (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 2. Update Timestamps
```sql
CREATE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيقه على الجداول:
CREATE TRIGGER update_profile_timestamp
  BEFORE UPDATE ON "Profile"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 📊 إحصائيات قاعدة البيانات

| الفئة | العدد |
|-------|------|
| **إجمالي الجداول** | 35 |
| **جداول المحتوى** | 10 (Book, Lecture, Story, Fatwa, etc.) |
| **جداول المستخدمين** | 5 (Profile, Comment, Rating, etc.) |
| **جداول الدورات** | 5 (Course, Module, Lesson, etc.) |
| **جداول النظام** | 5 (Analytics, Notification, etc.) |
| **Foreign Keys** | 8 |
| **RLS Policies** | 50+ |
| **Indexes** | 25+ |
| **Triggers** | 3 |

---

## 🚀 الخطوات التالية

1. ✅ البنية الأساسية منشأة
2. ✅ RLS Policies مفعلة
3. ✅ Indexes محسّنة
4. ✅ Triggers جاهزة
5. ⏳ بيانات تجريبية (Test Data) - جاري الإضافة
6. ⏳ Cloud Functions للعمليات المعقدة
7. ⏳ Real-time Subscriptions

---

## 📚 المراجع

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**آخر تحديث:** 2025-12-11
**الإصدار:** 1.0
**المشروع:** طريق النور (AlNourway)
