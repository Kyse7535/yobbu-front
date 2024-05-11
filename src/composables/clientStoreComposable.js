import { useStore } from "../store/client";

export default function useClientStoreComposable() {
  const store = useStore();
  return {
    getTrips: () => store.getTrips,
    getProviderDetails: () => store.getProviderDetails,
    getProviderTrips: () => store.getProviderTrips,
    getPanier: () => store.getPanier,
    fetchTrips: async ({
      date_departure,
      date_arrival,
      city_departure,
      city_arrival,
      country_departure,
      country_arrival,
    }) =>
      await store.fetchTrips({
        date_departure,
        date_arrival,
        city_departure,
        city_arrival,
        country_departure,
        country_arrival,
      }),

    fetchTripById: async (id) => await store.fetchTripById(id),

    fetchProviderDetails: async (url) => await store.fetchProviderDetails(url),
    fetchProviderTrips: async (url) => await store.fetchProviderTrips(url),
    addCommandToPanier: (order) => store.addCommandToPanier(order),
    removeCommandToPanier: (order_id) => store.removeCommandToPanier(order_id),
  };
}
