export interface ApiResponse<T> {
  success: boolean;
  result: T | null;
  message?: string;
  errors?: string[];
}

export interface ApiResponseWithPagination<T> extends ApiResponse<T> {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  startRecord: number;
  numberPages: number;
}
