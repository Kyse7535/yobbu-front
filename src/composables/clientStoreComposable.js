import { useStore } from "../store/client";

export default function useClientStoreComposable() {
  const store = useStore();
  return {
    getTrips: () => store.getTrips,
    getProviderDetails: () => store.getProviderDetails,
    getProviderTrips: () => store.getProviderTrips,
    getPanier: () => store.getPanier,
    getFormatTrips: () => store.getFormatTrips,
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

    fetchProviderDetails: async (provider_id) =>
      await store.fetchProviderDetails(provider_id),
    fetchProviderTrips: async (provider_id) =>
      await store.fetchProviderTrips(provider_id),
    addCommandToPanier: (order) => store.addCommandToPanier(order),
    removeCommandToPanier: (order_id) => store.removeCommandToPanier(order_id),
    fetchTripFormats: async (trip_id) => await store.fetchTripFormats(trip_id),
    setPanier: (panier) => store.setPanier(panier),
  };
}
