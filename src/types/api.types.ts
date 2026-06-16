export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}
