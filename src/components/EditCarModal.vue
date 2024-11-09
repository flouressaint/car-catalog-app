<script setup>
import { CarBrandService } from '@/service/CarBrandService';
import { CarService } from '@/service/CarService';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import JwtService from '@/service/jwtService';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const $emit = defineEmits(['close', 'update']);

const props = defineProps({
    show: Boolean,
    brands: Array,
    car: Object
})

const error = ref('');

const dataCar = computed(() => {
    return new Object({
        id: props.car.id,
        data: {
            model: props.car.model,
            brandId: props.car.brand.id,
            leftHandDrive: props.car.leftHandDrive
        }
    })
})

const updateCar = (car) => {
    if (!car.model || !car.brandId || !car.leftHandDrive) {
        error.value = 'Заполните все поля';
        return;
    }
    car.data.leftHandDrive = car.data.leftHandDrive === 'false' ? false : true;
    CarService.updateCar(car.id, car.data).then(() => {
        error.value = '';
        $emit('update', {
            id: car.id,
            model: car.data.model,
            brand: {
                id: car.data.brandId,
                name: props.brands.find((brand) => brand.id === car.data.brandId).name
            },
            leftHandDrive: car.data.leftHandDrive
        });
        $emit('close');
        // window.location.reload();
    }).catch((err) => {
        if (err.response.status === 401) {
            JwtService.destroyToken();
            router.push({ name: 'login' });
        }
        if (err.response.status === 409) {
            error.value = 'Такой автомобиль уже существует';
        }
    })
}

</script>

<template>
    <Transition name="EditCarModal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Изменение данных автомобиля</h3>
                </div>
                <div v-if="error" class="error">{{ error }}</div>

                <div class="modal-body">

                    <label>Марка</label>
                    <input type="text" v-model="dataCar.data.model" placeholder="Марка">
                    <label>Модель</label>
                    <select v-model="dataCar.data.brandId">
                        <option disabled value="">Выберите марку</option>
                        <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                    </select>

                    <label>Положение руля</label>
                    <select v-model="dataCar.data.leftHandDrive">
                        <option value="false">Правый руль</option>
                        <option value="true">Левый руль</option>
                    </select>
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" @click="$emit('close')">Отмена</button>
                    <button class="modal-default-button" @click="updateCar(dataCar)">Сохранить</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
}

.modal-container {
    width: 400px;
    margin: auto;
    padding: 20px 30px;
    background-color: var(--background);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

button {
    padding: 15px 20px;
    border-radius: 30px;
    border: 1px solid #ccc;
}

input {
    padding: 5px;
    font-size: 16px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
}

select {
    padding: 5px;
    font-size: 16px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
}

.error {
    color: red;
}

.modal-header h3 {
    margin: 0px;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-default-button {
    float: right;
}

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>