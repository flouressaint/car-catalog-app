import axios from 'axios';
import { API_URL } from '@/service/config';
import JwtService from '@/service/jwtService';

export const CarBrandService = {
    getBrandsData() {
        return axios
            .get(API_URL + 'car-brand', {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.data.items);
    },

    saveBrand(brand) {
        return axios
            .post(API_URL + 'admin/car-brand', brand, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JwtService.getToken()}`
                },
                withCredentials: true
            })
            .then((response) => response.data);
    },

    updateBrand(brand) {
        return axios
            .put(
                API_URL + 'manager/car-brand/' + brand.id,
                {
                    name: brand.name
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JwtService.getToken()}`
                    },
                    withCredentials: true
                }
            )
            .then((response) => response.data);
    },

    deleteBrand(id) {
        return axios
            .delete(API_URL + 'admin/car-brand/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JwtService.getToken()}`
                },
                withCredentials: true
            })
            .then((response) => response.data);
    },

    getBrandsMini() {
        return Promise.resolve(this.getBrandsData().slice(0, 5));
    },

    getBrandsSmall() {
        return Promise.resolve(this.getBrandsData().slice(0, 10));
    },

    getBrands() {
        return Promise.resolve(this.getBrandsData());
    }
};
