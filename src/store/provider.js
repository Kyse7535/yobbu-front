import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";
import useHandlerMessage from "@/composables/HandlerMessage";

const handlerMessage = useHandlerMessage();
const baseUrl = "http://localhost:4500";
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
        id: "d3b07384-d9a7-43a8-9b25-dc36d05ed812",
      },
      formats: [],
      modeTransports: [],
    };
  },
  getters: {
    getTrips: (state) => state.trips,
    getProviderInfo: (state) => state.provider,
    getFormats: (state) => state.formats,
    getModeTransports: (state) => state.modeTransports,
  },
  actions: {
    async fetchTrips() {
      try {
        let provider_id = this.provider.id;
        let url = baseUrl + "/api/v1/" + provider_id + "/Trips";
        let result = await axios.get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Accept": "*",
            "Access-Control-Content-Type": "*",
          },
        });
        if (result && result.data) {
          // let trips = [...this.trips].map((t) => (t && t.value ? t.value : t));
          // let trip_not_in_result = trips.filter(
          //   (t) => [...result.data].findIndex((tr) => tr.id === t.id) === -1
          // );
          // this.trips = [...result.data];
          // this.trips.push(trip_not_in_result);
          // this.trips = [...this.trips.flat()];
          this.trips = [...result.data];
        }
      } catch (error) {}
    },
    async deleteTrip(trip_id) {
      let result = await axios.delete(`${baseUrl}/api/v1/${trip_id}/Trip`, {
        headers,
      });
      if (result && result.status === 200) {
        const index = this.trips.findIndex((t) => t.id === trip_id);
        if (index > -1) {
          this.trips.splice(index, 1);
        }
      }
    },
    async addFormat(format) {
      let result = await axios.post(`${baseUrl}/api/v1/Trip/Formats`, format, {
        headers,
      });
      if (result && result.status === 200) {
        const index = this.formats.findIndex((f) => f.id === format.id);
        if (index > -1) {
          this.formats[index] = format;
        } else {
          this.formats.push(format);
        }
        return index;
      }
    },
    async updateFormat(format) {
      let result = await axios.put(
        `${baseUrl}/api/v1/Trip/Format/${format.id}`,
        format,
        {
          headers,
        }
      );
      if (result && result.status === 200) {
        const index = this.formats.findIndex((f) => f.id === format.id);
        if (index > -1) {
          this.formats[index] = format;
        } else {
          this.formats.push(format);
        }
        return index;
      }
    },
    updateFormats(formats) {
      // for (const format of formats) {
      //   await this.updateFormat(format)
      // }
    },
    async deleteFormat(format_id) {
      let result = await axios.delete(
        `${baseUrl}/api/v1/Trip/Format/${format_id}`,
        { headers }
      );
      if (result && result.status === 200) {
        const index = this.formats.findIndex((f) => f.id === format_id);
        if (index > -1) {
          this.formats.splice(format_id);
        }
        return index;
      }
    },
    async fetchTripFormats(trip_id) {
      let result = await axios.get(
        `${baseUrl}/api/v1/Trip/Formats/List/${trip_id}`,
        { headers }
      );
      if (result && result.data) {
        for (let _format of result.data) {
          const index = this.formats.findIndex((f) => f.id === _format);
          if (index > -1) {
            this.formats[index] = _format;
          } else {
            this.formats.push(_format);
          }
        }
      }
    },
    async addTrip(trip) {
      let result = await axios.post(`${baseUrl}/api/v1/Trips`, trip, {
        headers,
      });
      if (result && result.status === 200) {
        this.trips.push(trip);
      }
    },
    async updateTrip(trip) {
      let result = await axios.put(`${baseUrl}/api/v1/${trip.id}/Trip`, trip, {
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
    async fetchAllFormats() {
      let result = await axios.get(
        `${baseUrl}/api/v1/Trip/Format/Provider/${this.provider.id}`,
        { headers }
      );
      if (result && result.status === 200) {
        this.formats = result.data;
      }
    },
    async fetchModeTransports() {
      let result = await axios.get(
        `${baseUrl}/api/v1/Provider/ModeTransport/${this.provider.id}`,
        { headers }
      );
      if (result && result.status === 200) {
        this.modeTransports = result.data;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProviderStore, import.meta.hot));
}
