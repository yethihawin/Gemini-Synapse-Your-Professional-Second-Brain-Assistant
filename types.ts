export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface UserPreferences {
  domain?: 'General' | 'Coding' | 'Network' | 'Writing' | 'Weather';
}
