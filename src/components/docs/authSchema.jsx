export default {
  "authentication_method": "Supabase Auth",
  "providers": ["email"],
  "user_identification": {
    "primary_key": "id (UUID)",
    "email_key": "email (Unique)"
  },
  "user_profile_entity": "User",
  "user_profile_structure": {
    "table_name": "User",
    "link_field": "email",
    "fields": [
      {
        "name": "full_name",
        "type": "string",
        "description": "User's display name"
      },
      {
        "name": "email",
        "type": "string",
        "description": "User's email address (matches Auth)"
      },
      {
        "name": "role",
        "type": "string",
        "enum": ["user", "moderator", "admin"],
        "default": "user",
        "description": "Authorization role"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "default": true,
        "description": "Account status"
      }
    ]
  },
  "roles_and_permissions": {
    "admin": "Full access to dashboard, content management, and user management",
    "moderator": "Access to content management and moderation (comments/content)",
    "user": "Access to public app features, profile, enrollment, and personal interactions"
  }
};