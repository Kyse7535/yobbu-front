import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";
import useHandlerMessage from "@/composables/HandlerMessage";

// Your code using axios goes here

let url = `http://localhost:4500`;
let headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Accept": "*",
  "Access-Control-Content-Type": "*",
};
const handlerMessage = useHandlerMessage();
export const useStore = defineStore("trip", {
  state: () => ({
    trips: [],
    provider: {},
    provider_trips: [],
    panier: [],
    format_trips: [],
  }),
  getters: {
    getTrips: (state) => state.trips,
    getProviderDetails: (state) => state.provider,
    getProviderTrips: (state) => state.provider_trips,
    getPanier: (state) => state.panier,
    getFormatTrips: (state) => state.format_trips,
  },
  actions: {
    async fetchTrips({
      date_departure,
      date_arrival,
      city_departure,
      city_arrival,
      country_departure,
      country_arrival,
    }) {
      try {
        let response = await axios.get(url + "/api/v1/Trips", {
          params: {
            date_departure,
            date_arrival,
            city_departure,
            city_arrival,
            country_departure,
            country_arrival,
          },
          headers,
        });
        if (response.status === 200) {
          this.trips = response.data;
        }
      } catch (error) {
        handlerMessage.displayError(
          (error &&
            error.response &&
            error.response.data &&
            !!error.response.data.message) ||
            "impossible to find the resource"
        );
      }
    },

    async fetchTripById(id) {
      try {
        let response = await axios.get(url + `/api/v1/${id}/Trip`, {
          headers,
        });
        if (response.status === 200) {
          this.trips.push(response.data);
        }
      } catch (error) {
        handlerMessage.displayError(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            "impossible to find the resource"
        );
      }
    },

    async fetchProviderDetails(provider_id) {
      try {
        const result = await axios.get(`${url}/api/v1/Provider/${provider_id}`);
        if (result && result.status === 200) {
          this.provider = result.data;
        }
      } catch (error) {
        handlerMessage.displayError(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            "impossible to find the resource"
        );
      }
    },
    async fetchProviderTrips(provider_id) {
      try {
        const result = await axios.get(`${url}/api/v1/${provider_id}/Trips`, {
          headers,
        });
        if (result && result.status === 200) {
          this.provider_trips = result.data;
        }
      } catch (error) {
        handlerMessage.displayError(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            "impossible to find the resource"
        );
      }
    },
    addCommandToPanier(order) {
      const index = this.panier.findIndex((o) => o.id === order.id);
      if (index > -1) {
        this.panier[index] = order;
      } else {
        this.panier.push(order);
      }
    },
    removeCommandToPanier(order_id) {
      const index = this.panier.findIndex((o) => o.id === order_id);
      if (index > -1) {
        this.panier.splice(index, 1);
      }
    },
    async fetchTripFormats(trip_id) {
      //call api
      let call_url = `${url}/api/v1/Trip/Formats/List/${trip_id}`;
      let result = await axios.get(call_url, { headers });
      if (result && result.status === 200) {
        this.format_trips = result.data;
      }
    },
    setPanier(panier) {
      this.panier = panier;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
