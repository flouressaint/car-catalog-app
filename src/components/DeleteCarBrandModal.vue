<script setup>
import { CarBrandService } from '@/service/CarBrandService';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import JwtService from '@/service/jwtService';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const $emit = defineEmits(['close', 'delete']);
const props = defineProps({
    show: Boolean,
    brand: Object
})

const error = ref('');
const deleteBrand = (id) => {
    CarBrandService.deleteBrand(id).then(() => {
        error.value = '';
        $emit('delete', id);
        $emit('close');
    }).catch((err) => {
        if (err.response.status === 401) {
            JwtService.destroyToken();
            router.push({ name: 'login' });
        }
    })
}

</script>

<template>
    <Transition name="DeleteCarBrandModal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Удаление марки автомобиля</h3>
                </div>
                <div v-if="error" class="error">{{ error }}</div>

                <div class="modal-body">
                    Действительно хотите удалить марку {{ brand.name }}?
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" @click="$emit('close')">Отмена</button>
                    <button class="modal-default-button" @click="deleteBrand(brand.id)">Удалить</button>
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

input {
    padding: 5px;
    font-size: 16px;
    width: 100%;
    padding: 20px 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
}


button {
    padding: 15px 20px;
    border-radius: 30px;
    border: 1px solid #ccc;
}

.error {
    color: red;
}

.modal-header h3 {
    margin: 0;
}

.modal-body {
    display: flex;
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