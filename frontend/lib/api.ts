import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getData = <T>(response: AxiosResponse<T>): T => response.data;

apiClient.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const jwt = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("jwt="))
      ?.split("=")
      .slice(1)
      .join("=");

    if (jwt) {
      const authorization = ["Bearer", decodeURIComponent(jwt)].join(" ");
      config.headers.set("Authorization", authorization);
    }
  }

  return config;
});

export const get = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => apiClient.get<T>(url, config).then(getData);

export const post = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<T> => apiClient.post<T>(url, data, config).then(getData);

export const put = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<T> => apiClient.put<T>(url, data, config).then(getData);

export const patch = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<T> => apiClient.patch<T>(url, data, config).then(getData);

export const deleteRequest = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => apiClient.delete<T>(url, config).then(getData);

export default apiClient;
