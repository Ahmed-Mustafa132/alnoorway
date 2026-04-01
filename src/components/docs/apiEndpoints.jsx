export default {
  "base_url": "https://[project-ref].supabase.co",
  "rest_api": {
    "base_path": "/rest/v1",
    "common_methods": ["GET", "POST", "PATCH", "DELETE"],
    "headers": {
      "apikey": "SUPABASE_ANON_KEY",
      "Authorization": "Bearer [JWT_TOKEN]",
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    "endpoints": [
      { "path": "/User", "description": "CRUD operations for User profiles" },
      { "path": "/CourseEnrollment", "description": "Manage course enrollments" },
      { "path": "/Book", "description": "Library books" },
      { "path": "/Lecture", "description": "Audio/Video lectures" },
      { "path": "/Fatwa", "description": "Fatwa archive" },
      { "path": "/Story", "description": "Stories" },
      { "path": "/QuranCourse", "description": "Quran courses" },
      { "path": "/Comment", "description": "User comments" },
      { "path": "/Rating", "description": "Content ratings" },
      { "path": "/Notification", "description": "User notifications" },
      { "path": "/ReconciliationCommittee", "description": "Committee members" }
    ]
  },
  "backend_functions": {
    "base_path": "/functions/v1",
    "endpoints": [
      {
        "name": "aiAssistant",
        "method": "POST",
        "url": "/functions/v1/aiAssistant",
        "description": "AI-powered features: Chat, Summarization, Recommendation, Question Refinement",
        "payload_schema": {
          "action": "string (chat | summarize | refine_question | recommend)",
          "text": "string (optional)",
          "prompt": "string (optional)",
          "userHistory": "array (optional)"
        }
      },
      {
        "name": "adminUsers",
        "method": "POST",
        "url": "/functions/v1/adminUsers",
        "description": "Admin operations for user management",
        "payload_schema": {
          "action": "string (update_role | toggle_active | reset_password)",
          "userId": "string (UUID)",
          "role": "string",
          "isActive": "boolean",
          "email": "string"
        }
      }
    ]
  }
};