-- Add sender_name column to course_chat_messages for displaying sender names in chat
ALTER TABLE course_chat_messages ADD COLUMN IF NOT EXISTS sender_name TEXT;
