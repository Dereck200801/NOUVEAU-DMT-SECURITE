import { api } from "../api";

// Types
interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
}

export const companyService = {
  // Récupérer les informations de l'entreprise
  getCompanyInfo: () => api.get<CompanyInfo>('/company'),
  
  // Mettre à jour les informations de l'entreprise
  updateCompanyInfo: (data: Partial<CompanyInfo>) => api.put<CompanyInfo>('/company', data),
  
  // Mettre à jour le logo de l'entreprise
  updateLogo: (logoFile: File) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    return api.post<{ logoUrl: string }>('/company/logo', formData);
  }
}; 