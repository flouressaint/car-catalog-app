<script setup>
import { CarService } from '@/service/CarService';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import JwtService from '@/service/jwtService';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const $emit = defineEmits(['close', 'create']);
const props = defineProps({
    show: Boolean,
    brands: Array
})

const error = ref('');
const car = ref({
    model: '',
    brandId: null,
    leftHandDrive: null
})

watch(() => props.show, () => {
    car.value = ref({ model: '', brandId: null, leftHandDrive: null });
    error.value = '';
})

const createCar = (car) => {
    if (!car.model || !car.brandId || !car.leftHandDrive) {
        error.value = 'Заполните все поля';
        return;
    }
    car.leftHandDrive = car.leftHandDrive === 'false' ? false : true;
    CarService.saveCar(car).then((data) => {
        error.value = '';
        $emit('create', {
            ...data,
            model: car.model,
            brand: {
                id: car.brandId,
                name: props.brands.find((brand) => brand.id === car.brandId).name
            },
            leftHandDrive: car.leftHandDrive
        });
        $emit('close');
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

watch(car.value, () => {
    error.value = '';
})

</script>

<template>
    <Transition name="CreateCarModal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Добавление автомобиля</h3>
                </div>
                <div v-if="error" class="error">{{ error }}</div>

                <div class="modal-body">
                    <label>Модель</label>
                    <input type="text" v-model="car.model">
                    <label>Марка</label>
                    <select v-model="car.brandId">
                        <option disabled value="">Выберите марку</option>
                        <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                    </select>

                    <label>Положение руля</label>
                    <select v-model="car.leftHandDrive">
                        <option value="false">Правый руль</option>
                        <option value="true">Левый руль</option>
                    </select>
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" @click="$emit('close')">Отмена</button>
                    <button class="modal-default-button" @click="createCar(car)">Добавить</button>
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