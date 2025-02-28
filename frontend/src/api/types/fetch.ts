// api/types/fetch.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Résultat avec succès ou erreur
export type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };

// Paramètres supplémentaires
export interface FetchParams {
  [key: string]: string | number | boolean | undefined;
}

// Réponse API simple (sans pagination)
export interface ApiResponse<T> {
  data: T;
}
