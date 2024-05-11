import { useProviderStore } from "../store/provider";

export default function useProviderStoreComposable() {
  const store = useProviderStore();
  return {
    fetchTrips: async () => await store.fetchTrips(),
    getTrips: () => store.getTrips,
    deleteTrip: async (trip_id) => await store.deleteTrip(trip_id),
    addFormat: (format) => store.addFormat(format),
    deleteFormat: (format) => store.deleteFormat(format),
    addTrip: (trip) => store.addTrip(trip),
  };
}
