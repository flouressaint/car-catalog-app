<script setup>
import { ref, computed, inject, watch } from 'vue';
import { CarService } from '@/service/CarService';
import { CarBrandService } from '@/service/CarBrandService';
import CreateCarModal from '@/components/CreateCarModal.vue';
import EditCarModal from '@/components/EditCarModal.vue';
import DeleteCarModal from '@/components/DeleteCarModal.vue';
import { AnFilledEdit, AnFilledDelete, AkPlus } from '@kalimahapps/vue-icons';

const current_user = inject('current_user');

const isAdmin = computed(() => {
    return current_user.value && current_user.value.roles.includes('ROLE_ADMIN');
});
const isManager = computed(() => {
    return current_user.value && current_user.value.roles.includes('ROLE_MANAGER');
});

const cars = ref();
const car = ref();

const dataCars = ref();
CarService.getCars().then(data => {
    dataCars.value = data;
    cars.value = data;
});

const dataCarBrands = ref();
CarBrandService.getBrands().then(data => {
    dataCarBrands.value = data;
})

const createCar = (car) => {
    dataCars.value.unshift(car);
}

const updateCar = (car) => {
    for (let i = 0; i < dataCars.value.length; i++) {
        if (dataCars.value[i].id === car.id) {
            dataCars.value[i] = car;
            break;
        }
    }
};

const deleteCar = (id) => {
    for (let i = 0; i < dataCars.value.length; i++) {
        if (dataCars.value[i].id === id) {
            dataCars.value.splice(i, 1);
            break;
        }
    }
};

const query = ref('');

watch(query, () => {
    cars.value = dataCars.value.filter((car) => {
        return (car.model + ' ' + car.brand.name + ' ').toLowerCase().includes(query.value.toLowerCase())
            || (car.brand.name + ' ' + car.model + ' ').toLowerCase().includes(query.value.toLowerCase());
    });
})


watch(dataCars, () => {
    cars.value = dataCars.value;
    if (query.value) {
        cars.value = dataCars.value.filter((car) => {
            return (car.model + ' ' + car.brand.name).toLowerCase().includes(query.value.toLowerCase())
                || (car.brand.name + ' ' + car.model).toLowerCase().includes(query.value.toLowerCase());
        });
    }
}, { deep: true });


const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
</script>

<template>
    <div class="car-page">
        <h1>Автомобили</h1>
        <div class="card-list">
            <div class="search">
                <input type="text" v-model="query" placeholder="Поиск...">
                <AkPlus v-if="isAdmin" class="create" @click="showCreateModal = true" />
            </div>
            <div class="card" v-if="cars && cars.length === 0">Ничего не найдено</div>
            <div class="scroll">
                <div class="card" v-for="carElem in cars" :key="carElem.id">
                    <div class="car-info">
                        <div class="car-brand">
                            {{ carElem.brand.name }}
                        </div>
                        <div class="car-model">
                            {{ carElem.model }}
                        </div>
                        <div class="car-drive">
                            {{ carElem.leftHandDrive ? 'Левый руль' : 'Правый руль' }}
                        </div>
                    </div>
                    <div class="actions">
                        <AnFilledEdit v-if="isAdmin || isManager" class="edit" id="show-modal"
                            @click="showEditModal = true; car = Object.assign({}, carElem);" " />
                    <AnFilledDelete v-if="isAdmin" class=" delete"
                            @click="showDeleteModal = true; car = Object.assign({}, carElem);" " />
                </div>
                </div>
            </div>
        </div>
    </div>
                    <editCarModal :car="car" :brands="dataCarBrands" @update="updateCar" :show="showEditModal"
                            @close="showEditModal = false" />
                        <deleteCarModal :car="car" @delete="deleteCar" :show="showDeleteModal"
                            @close="showDeleteModal = false" />
                        <createCarModal :brands="dataCarBrands" @create="createCar" @close="showCreateModal = false"
                            :show="showCreateModal" />
</template>

<style scoped>
.car-page {
    margin-bottom: 100px;
}

.card-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0px 30px;
    gap: 20px;
}

.car-info {
    text-wrap: wrap;
    display: flex;
    flex-direction: row;
    gap: 20px;
    word-break: break-all;
}

.car-brand {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.car-model {
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.car-drive {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
}

.scroll {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0px 30px;
    gap: 10px;
    overflow-y: scroll;
    max-height: 70dvh;
}

h1 {
    text-align: center;
}

.card {
    text-align: center;
    border-radius: 10px;
    box-shadow: rgba(54, 66, 87, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 30px;
    gap: 10px;
    color: #cdcdcd;
}

.edit,
.delete {
    border: 1px solid var(--primary);
    padding: 4px;
    color: #cdcdcd;
    font-size: 30px;
    border-radius: 10px;
    cursor: pointer;
}

.edit:hover,
.delete:hover {
    box-shadow: 0 0 10px var(--primary);
}

.create {
    border: 1px solid var(--primary);
    padding: 7px;
    color: white;
    font-size: 30px;
    border-radius: 10px;
    cursor: pointer;
    background-color: var(--primary);
}

.create:hover {
    box-shadow: 0 0 10px var(--primary);
}

.search {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

input {
    padding: 5px;
    font-size: 16px;
    width: 225px;
    border-radius: 10px;
    padding: 15px 20px;
    border: 1px solid #ccc;
}

@media (prefers-color-scheme: dark) {
    .edit:hover {
        color: white;
    }

    .delete:hover {
        color: white;
    }

    .card {
        border: 1px solid var(--primary);
    }
}

@media only screen and (max-width: 768px) {

    .card {
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

    }

    .car-info {
        flex-direction: column;
        text-align: left;
    }

    .car-brand {
        width: 100%;
        display: inline;
    }

    .car-model {
        width: 100%;
        display: inline;
    }

    .car-drive {
        display: inline;
        width: 100%;
    }

}

@media only screen and (max-width: 425px) {
    h1 {
        font-size: 25px;
    }

    input {
        width: 160px;
    }

    .card {
        width: 230px;
    }
}
</style>