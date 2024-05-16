import { useProviderStore } from "../store/provider";

export default function useProviderStoreComposable() {
  const store = useProviderStore();
  return {
    fetchTrips: async () => await store.fetchTrips(),
    getTrips: () => store.getTrips,
    deleteTrip: async (trip_id) => await store.deleteTrip(trip_id),
    addFormat: (format) => store.addFormat(format),
    deleteFormat: (format_id) => store.deleteFormat(format_id),
    addTrip: (trip) => store.addTrip(trip),
    updateFormats: (formats) => store.updateFormats(formats),
    getFormats: () => store.getFormats,
    getProviderInfo: () => store.getProviderInfo,
  };
}
