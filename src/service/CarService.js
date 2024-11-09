import axios from 'axios';
import { API_URL } from '@/service/config';
import JwtService from '@/service/jwtService';

export const CarService = {
    getCarsData() {
        return axios
            .get(API_URL + 'car', {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.data.items);
    },

    saveCar(car) {
        return axios
            .post(API_URL + 'admin/car', car, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JwtService.getToken()}`
                },
                withCredentials: true
            })
            .then((response) => response.data)
    },

    updateCar(id, car) {
        return axios
            .put(API_URL + 'manager/car/' + id, car, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JwtService.getToken()}`
                },
                withCredentials: true
            })
            .then((response) => response.data)
    },

    deleteCar(id) {
        return axios
            .delete(API_URL + 'admin/car/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JwtService.getToken()}`
                },
                withCredentials: true
            })
            .then((response) => response.data)
    },

    getCars() {
        return Promise.resolve(this.getCarsData());
    }
};
