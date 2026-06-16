export interface LeafletMapState {
  isReady: boolean;
  error: string | null;
}

export function useLeafletMap(): LeafletMapState {
  return {
    isReady: false,
    error: null,
  };
}
