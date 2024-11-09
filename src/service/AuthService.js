import axios from 'axios';
import { API_URL } from '@/service/config';
import { saveToken, destroyToken } from '@/service/jwtService';
export const AuthService = {
    login(user) {
        return axios
            .post(API_URL + 'auth/login', {
                username: user.username,
                password: user.password
            })
            .then((response) => {
                if (response.data.token) {
                    saveToken(response.data.token);
                }

                return response.data;
            });
    },

    logout() {
        destroyToken();
        // window.location.reload();
    }
};
