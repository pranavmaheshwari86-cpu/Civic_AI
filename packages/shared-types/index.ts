export interface User {
  id: string;
  phone: string;
  createdAt: Date;
}

export interface Complaint {
  id: string;
  trackingId: string;
  userId: string;
  category: string;
  status: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  photoUrls: string[];
  createdAt: Date;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intentCategory?: string;
  confidenceScore?: number;
  createdAt: Date;
}
