// Configuration de base pour les appels API
const API_BASE_URL = 'http://localhost:3002/api';

// Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Fonction générique pour les appels API
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici d'autres headers si nécessaire (ex: Authorization)
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue'
    };
  }
}

// Exportation des fonctions d'API
export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, body: any) => apiCall<T>(endpoint, 'POST', body),
  put: <T>(endpoint: string, body: any) => apiCall<T>(endpoint, 'PUT', body),
  delete: <T>(endpoint: string) => apiCall<T>(endpoint, 'DELETE'),
}; 