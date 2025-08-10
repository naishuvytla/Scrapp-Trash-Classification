import * as FileSystem from "expo-file-system";

export const BASE_URL = "http://127.0.0.1:8000";

export type ClassifyResponse = {
  label: string;                          
  confidence?: number;                    
  probs?: Record<string, number>;         
  instructions?: string;                  
  topK?: { label: string; p: number }[];  
  message?: string;                       
};

export async function classifyImageAsync(uri: string, token?: string) {
  const res = await FileSystem.uploadAsync(
    `${BASE_URL}/api/classify/`,
    uri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "image", 
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  if (res.status !== 200) {
    throw new Error(`Classify failed (${res.status}): ${res.body}`);
  }
  return JSON.parse(res.body) as ClassifyResponse;
}