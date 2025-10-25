class ApiService {
  private async request<T>(url: string, options: RequestInit): Promise<[T | null, Error | null]> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'An unknown error occurred.' };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return [data, null];
    } catch (error: any) {
      return [null, error];
    }
  }

  public get<T>(url: string, options: RequestInit = {}): Promise<[T | null, Error | null]> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public post<T>(url: string, body: any, options: RequestInit = {}): Promise<[T | null, Error | null]> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  public put<T>(url: string, body: any, options: RequestInit = {}): Promise<[T | null, Error | null]> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  public delete<T>(url: string, options: RequestInit = {}): Promise<[T | null, Error | null]> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiService();


