export interface ApiResponseDTO<T> {
  id: number;
  result: T | null;
  success: boolean;
  message?: string;
  innerExceptionMessage?: string | null;
  errors?: string[];
  startRecord?: number | null;
  numberRecords?: number | null;
  totalRecords?: number | null;
  pageNumber?: number | null;
  numberPages?: number | null;
}
