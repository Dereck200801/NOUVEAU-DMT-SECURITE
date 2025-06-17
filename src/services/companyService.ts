// Local-only implementation using localStorage
export interface CompanyInfo {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
}

const KEY = 'companyInfo';

export const companyService = {
  getCompanyInfo(): Promise<CompanyInfo> {
    const stored = localStorage.getItem(KEY);
    if (stored) return Promise.resolve(JSON.parse(stored));
    // default empty company
    const empty: CompanyInfo = { companyName: '', address: '', phone: '', email: '' };
    return Promise.resolve(empty);
  },

  updateCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const current = localStorage.getItem(KEY);
    const merged = { ...(current ? JSON.parse(current) : {}), ...data };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return Promise.resolve(merged);
  },
}; 