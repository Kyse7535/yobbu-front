import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";
import useHandlerMessage from "@/composables/HandlerMessage";

const handlerMessage = useHandlerMessage();
const baseUrl = "http://localhost:4500/";
let headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Accept": "*",
  "Access-Control-Content-Type": "*",
  "Content-Type": "application/json",
};
export const useProviderStore = defineStore("provider", {
  state: () => {
    return {
      trips: [],
      provider: {
        id: "df7f3b02-0328-4bdc-9a1d-fc58eb5ee7fc",
      },
      formats: [],
    };
  },
  getters: {
    getTrips: (state) => state.trips,
    getProviderInfo: (state) => state.provider,
    getFormats: (state) => state.formats,
  },
  actions: {
    async fetchTrips() {
      try {
        let provider_id = this.provider.id;
        let url = baseUrl + "api/v1/" + provider_id + "/Trips";
        let result = await axios.get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Accept": "*",
            "Access-Control-Content-Type": "*",
          },
        });
        if (result && result.data) {
          let trips = [...this.trips].map((t) => (t && t.value ? t.value : t));
          let trip_not_in_result = trips.filter(
            (t) => [...result.data].findIndex((tr) => tr.id === t.id) === -1
          );
          this.trips = [...result.data];
          this.trips.push(trip_not_in_result);
          this.trips = [...this.trips.flat()];
        }
      } catch (error) {}
    },
    delay() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    async deleteTrip(trip_id) {
      try {
        //await axios.delete(`${baseUrl}/trips/${trip_id}/Trip`)
        await this.delay();
        let index = this.trips.findIndex((t) => t.id === trip_id);

        if (index > -1) {
          this.trips.splice(index, 1);
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
    addFormat(format) {
      let result;
      const index = this.formats.findIndex((f) => f.id === format.id);
      if (index > -1) {
        this.formats[index] = format;
      } else {
        this.formats.push(format);
      }
      return index;
    },
    updateFormats(formats) {
      this.formats = [...formats];
    },
    deleteFormat(format_id) {
      const index = this.formats.findIndex((f) => f.id === format_id);
      if (index > -1) {
        this.formats.splice(index, 1);
      }
    },
    async addTrip(trip) {
      let result = await axios.post(`${baseUrl}api/v1/Trips`, trip, {
        headers,
      });
      if (result && result.status === 200) {
        const index = this.trips.findIndex((t) => t.id === trip.id);
        if (index > -1) {
          this.trips[index] = trip;
        } else {
          this.trips.push(trip);
        }
        return index;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProviderStore, import.meta.hot));
}
