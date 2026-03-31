export interface PaginationResult {
  skip: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export class PaginationService {
  /**
   * Calcula los parámetros de paginación basado en página y límite
   * @param page - Número de página (1-indexed)
   * @param limit - Cantidad de elementos por página
   * @param totalItems - Cantidad total de elementos (para calcular totalPages)
   * @returns Objeto con skip, limit, currentPage y totalPages
   */
  public static calculatePagination(page: number, limit: number, totalItems: number): PaginationResult {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, limit);

    const skip = (validPage - 1) * validLimit;
    const totalPages = Math.ceil(totalItems / validLimit) || 1;

    // Si la página solicitada está fuera de rango, ajustar a última página válida
    const currentPage = Math.min(validPage, totalPages);

    return {
      skip,
      limit: validLimit,
      currentPage,
      totalPages,
    };
  }
}
