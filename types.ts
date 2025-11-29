export enum GenerationMode {
  Standard = 'standard',
  Search = 'search',
  Thinking = 'thinking',
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export type Language = 'en' | 'es';

export interface QuickAction {
  label: string;
  value: string;
  icon: string;
}

export interface EmailRecord {
  id: string;
  fields: {
    Status: string;
    "Sender Name": string;
    "Sender Email": string;
    "Original Subject": string;
    "Original Body": string;
    "Received At": string;
    "Thread ID": string;
    "Draft Reply Body"?: string;
  };
  createdTime: string;
}
