import { useProviderStore } from "../store/provider";

export default function useProviderStoreComposable() {
  const store = useProviderStore();
  return {
    fetchTrips: async () => await store.fetchTrips(),
    getTrips: () => store.getTrips,
    deleteTrip: async (trip_id) => await store.deleteTrip(trip_id),
    addFormat: async (format) => await store.addFormat(format),
    deleteFormat: async (format_id) => await store.deleteFormat(format_id),
    addTrip: async (trip) => await store.addTrip(trip),
    updateTrip: async (trip) => await store.updateTrip(trip),
    updateFormat: async (format) => await store.updateFormat(format),
    getFormats: () => store.getFormats,
    getProviderInfo: () => store.getProviderInfo,
    fetchTripFormats: async (trip_id) => await store.fetchTripFormats(trip_id),
    fetchAllFormats: async () => await store.fetchAllFormats(),
    fetchModeTransports: async () => await store.fetchModeTransports(),
    getModeTransports: () => store.getModeTransports,
  };
}
