import { defineStore } from "pinia";
import axios from "axios";
import useHandlerMessage from "../composables/HandlerMessage";

// Your code using axios goes here

let url = `http://localhost:4500`;
const handlerMessage = useHandlerMessage();
export const useStore = defineStore("trip", {
  state: () => ({
    trips: [],
    provider: {},
    provider_trips: [],
  }),
  getters: {
    getTrips: (state) => state.trips,
    getProviderDetails: (state) => state.provider,
    getProviderTrips: (state) => state.provider_trips,
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
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Accept": "*",
            "Access-Control-Content-Type": "*",
          },
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
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Accept": "*",
            "Access-Control-Content-Type": "*",
          },
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

    async fetchProviderDetails(url) {
      try {
        const result = await axios.get(url);
        if (result.status === 200) {
          this.provider = result.data && result.data[0];
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
    async fetchProviderTrips(url) {
      try {
        const result = await axios.get(url);
        if (result.status === 200) {
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
  },
});
