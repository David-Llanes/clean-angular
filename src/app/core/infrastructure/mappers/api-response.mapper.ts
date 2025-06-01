import { ApiResponseDTO } from '../dto/api-response.dto';
import {
  ApiResponse,
  ApiResponseWithPagination,
} from '../models/api-response.model';

export class ApiResponseMapper {
  static fromWrapper<T>(response: ApiResponseDTO<any>): ApiResponse<T> {
    return {
      result: response.result ?? null,
      success: response.success ?? false,
      message: response.message ?? '',
      errors: response.errors ?? [],
    };
  }

  static fromPaginatedWrapper<T>(
    response: ApiResponseDTO<any>
  ): ApiResponseWithPagination<T> {
    return {
      ...this.fromWrapper<T>(response),
      startRecord: response.startRecord ?? 0,
      pageSize: response.numberRecords ?? 0,
      totalRecords: response.totalRecords ?? 0,
      currentPage: response.pageNumber ?? 1,
      numberPages: response.numberPages ?? 1,
    };
  }

  static autoDetect<T>(
    response: ApiResponseDTO<any>
  ): ApiResponse<T> | ApiResponseWithPagination<T> {
    const isPaginated =
      response.totalRecords !== null &&
      response.totalRecords !== undefined &&
      typeof response.totalRecords === 'number' &&
      response.pageNumber !== null &&
      response.pageNumber !== undefined &&
      response.numberPages !== null &&
      response.numberPages !== undefined;

    // eslint-disable-next-line no-console
    console.log('ApiResponseDTO from ApiResponseMapper.autoDetect()', {
      isPaginated,
      response,
    });

    const mappedResponse = isPaginated
      ? this.fromPaginatedWrapper<T>(response)
      : this.fromWrapper<T>(response);

    // eslint-disable-next-line no-console
    console.log('ApiResponse', mappedResponse);

    return mappedResponse;
  }
}
