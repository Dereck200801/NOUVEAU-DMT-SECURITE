export interface Client {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  activeMissions: number;
  totalMissions: number;
  created_at?: string;
  updated_at?: string;
}

export type NewClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

export interface ClientFormProps {
  client?: Client;
  onSubmit: (data: NewClient | Partial<Client>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  existingTypes: string[];
} 