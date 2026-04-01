export default {
  "User": [
    {
      "id": "u1",
      "full_name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "admin",
      "is_active": true,
      "created_date": "2024-01-01T10:00:00Z"
    },
    {
      "id": "u2",
      "full_name": "سارة علي",
      "email": "sara@example.com",
      "role": "user",
      "is_active": true,
      "created_date": "2024-01-02T11:00:00Z"
    },
    {
      "id": "u3",
      "full_name": "خالد عمر",
      "email": "khaled@example.com",
      "role": "moderator",
      "is_active": true,
      "created_date": "2024-01-03T12:00:00Z"
    }
  ],
  "CourseEnrollment": [
    {
      "id": "ce1",
      "course_id": "qc1",
      "user_email": "sara@example.com",
      "user_name": "سارة علي",
      "gender": "female",
      "status": "approved",
      "progress": 25,
      "created_date": "2024-02-01T09:00:00Z"
    },
    {
      "id": "ce2",
      "course_id": "qc2",
      "user_email": "ahmed@example.com",
      "user_name": "أحمد محمد",
      "gender": "male",
      "status": "pending",
      "progress": 0,
      "created_date": "2024-02-05T14:00:00Z"
    }
  ],
  "Book": [
    {
      "id": "b1",
      "title": "رياض الصالحين",
      "author": "الإمام النووي",
      "category": "hadith",
      "pages": 500,
      "description": "كتاب جامع للأحاديث الصحيحة",
      "language": "ar"
    },
    {
      "id": "b2",
      "title": "تفسير السعدي",
      "author": "عبدالرحمن السعدي",
      "category": "tafsir",
      "pages": 1000,
      "description": "تيسير الكريم الرحمن في تفسير كلام المنان",
      "language": "ar"
    }
  ],
  "QuranCourse": [
    {
      "id": "qc1",
      "title": "دورة تحفيظ جزء عم",
      "teacher_name": "الشيخ محمد",
      "type": "memorization",
      "gender": "male",
      "level": "beginner",
      "is_active": true,
      "schedule": "الأحد والثلاثاء 5 مساءً"
    },
    {
      "id": "qc2",
      "title": "تصحيح التلاوة للنساء",
      "teacher_name": "أستاذة فاطمة",
      "type": "recitation",
      "gender": "female",
      "level": "intermediate",
      "is_active": true,
      "schedule": "السبت والأربعاء 4 عصراً"
    }
  ],
  "Lecture": [
    {
      "id": "l1",
      "title": "فضل الصبر",
      "speaker": "الشيخ فلان",
      "type": "video",
      "category": "learn_islam",
      "duration": "45:00",
      "views_count": 1500
    },
    {
      "id": "l2",
      "title": "قصص الأنبياء - آدم عليه السلام",
      "speaker": "الشيخ علان",
      "type": "audio",
      "category": "general",
      "duration": "30:00",
      "views_count": 2300
    }
  ],
  "Fatwa": [
    {
      "id": "f1",
      "question": "ما حكم صلاة الضحى؟",
      "answer": "سنة مؤكدة، أقلها ركعتان.",
      "category": "عبادات",
      "mufti": "لجنة الفتوى"
    },
    {
      "id": "f2",
      "question": "حكم البيع بالتقسيط",
      "answer": "جائز بشروط.",
      "category": "معاملات",
      "mufti": "الشيخ فلان"
    }
  ],
  "Comment": [
    {
      "id": "c1",
      "user_name": "سارة",
      "user_email": "sara@example.com",
      "content_type": "lecture",
      "content_id": "l1",
      "comment_text": "جزاكم الله خيراً، محاضرة قيمة.",
      "is_approved": true
    }
  ],
  "Scholar": [
    {
      "id": "s1",
      "name": "الشيخ عبدالله",
      "type": "mufti",
      "specialization": "fiqh",
      "country": "Saudi Arabia",
      "is_available": true
    }
  ]
};