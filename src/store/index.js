import { defineStore } from 'pinia'
import axios from 'axios';

// Your code using axios goes here


export const useStore = defineStore('trip', {
    state: () => ({trips: [],}),
    getters: {
        getTrips: (state) => state.trips
    },
    actions: {
        async fetchTrips ({date_departure, date_arrival, city_departure, city_arrival, country_departure, country_arrival}) {
            try {
                let url = `http://localhost:4500/api/v1/Trips`
                let response = await axios.get(url, {
                    params: {
                        date_departure, date_arrival, city_departure, city_arrival, country_departure, country_arrival
                    },
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Accept": "*",
                        "Access-Control-Content-Type": "*"
                    }
                })
            if (response.status === 200) {
                this.trips = response.data
            }
            } catch (error) {
                throw new Error("error when fetching data")
            }
        }
    }
})