export default {
  "CourseEnrollment": {
    "related_to": {
      "QuranCourse": {
        "foreign_key": "course_id",
        "reference_field": "id",
        "type": "many-to-one"
      },
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "many-to-one"
      }
    }
  },
  "Comment": {
    "related_to": {
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "many-to-one"
      },
      "Book": {
        "foreign_key": "content_id",
        "reference_field": "id",
        "type": "many-to-one",
        "condition": "content_type == 'book'"
      },
      "Lecture": {
        "foreign_key": "content_id",
        "reference_field": "id",
        "type": "many-to-one",
        "condition": "content_type == 'lecture'"
      },
      "Story": {
        "foreign_key": "content_id",
        "reference_field": "id",
        "type": "many-to-one",
        "condition": "content_type == 'story'"
      },
      "Fatwa": {
        "foreign_key": "content_id",
        "reference_field": "id",
        "type": "many-to-one",
        "condition": "content_type == 'fatwa'"
      }
    }
  },
  "Rating": {
    "related_to": {
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "many-to-one"
      },
      "Book": {
        "foreign_key": "content_id",
        "reference_field": "id",
        "type": "many-to-one",
        "condition": "content_type == 'book'"
      }
    }
  },
  "Notification": {
    "related_to": {
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "many-to-one"
      }
    }
  },
  "Favorite": {
    "related_to": {
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "many-to-one"
      }
    }
  },
  "UserPreference": {
    "related_to": {
      "User": {
        "foreign_key": "user_email",
        "reference_field": "email",
        "type": "one-to-one"
      }
    }
  },
  "CourseModule": {
    "related_to": {
      "Course": {
        "foreign_key": "course_id",
        "reference_field": "id",
        "type": "many-to-one"
      }
    }
  },
  "CourseLesson": {
    "related_to": {
      "CourseModule": {
        "foreign_key": "module_id",
        "reference_field": "id",
        "type": "many-to-one"
      }
    }
  }
};