<script setup>
import { CarBrandService } from '@/service/CarBrandService';
import { ref, watch, computed, inject } from 'vue';
import CreateCarBrandModal from '@/components/CreateCarBrandModal.vue';
import EditCarBrandModal from '@/components/EditCarBrandModal.vue';
import DeleteCarBrandModal from '@/components/DeleteCarBrandModal.vue';
import { AnFilledEdit, AnFilledDelete, AkPlus } from '@kalimahapps/vue-icons';

const carBrands = ref();
const dataCarBrands = ref();
const brand = ref();
const current_user = inject('current_user');

const isAdmin = computed(() => {
    return current_user.value && current_user.value.roles.includes('ROLE_ADMIN');
});
const isManager = computed(() => {
    return current_user.value && current_user.value.roles.includes('ROLE_MANAGER');
});

CarBrandService.getBrands().then(data => {
    dataCarBrands.value = data;
    carBrands.value = data;
});

const createBrand = (brand) => {
    dataCarBrands.value.unshift(brand);
}

const updateBrand = (brand) => {
    for (let i = 0; i < dataCarBrands.value.length; i++) {
        if (dataCarBrands.value[i].id === brand.id) {
            dataCarBrands.value[i] = brand;
            break;
        }
    }
};

const deleteBrand = (id) => {
    for (let i = 0; i < dataCarBrands.value.length; i++) {
        if (dataCarBrands.value[i].id === id) {
            dataCarBrands.value.splice(i, 1);
            break;
        }
    }
};

const query = ref('');

watch(query, () => {
    carBrands.value = dataCarBrands.value.filter((carBrand) => {
        return carBrand.name.toLowerCase().includes(query.value.toLowerCase());
    });
})


watch(dataCarBrands, () => {
    carBrands.value = dataCarBrands.value;
    if (query.value) {
        carBrands.value = dataCarBrands.value.filter((carBrand) => {
            return carBrand.name.toLowerCase().includes(query.value.toLowerCase());
        });
    }
}, { deep: true });


const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
</script>

<template>
    <div class="car-categories-page">
        <h1>Марки автомобилей</h1>
        <div class="brand-list">
            <div class="search">
                <input type="text" v-model="query" placeholder="Поиск...">
                <AkPlus v-if="isAdmin" class="create" @click="showCreateModal = true" />
            </div>
            <div class="card" v-if="carBrands && carBrands.length === 0">Ничего не найдено</div>
            <div class="scroll">
                <div class="card" v-for="carBrand in carBrands" :key="carBrand.id">
                    <div class="brand-info">
                        {{ carBrand.name }}
                    </div>
                    <div class="actions">
                        <AnFilledEdit v-if="isAdmin || isManager" class="edit" id="show-modal"
                            @click="showEditModal = true; brand = Object.assign({}, carBrand);" " />
                        <AnFilledDelete v-if="isAdmin" class=" delete"
                            @click="showDeleteModal = true; brand = Object.assign({}, carBrand);" " />
                    </div>
                </div>
            </div>
        </div>
    </div>
                    <editCarBrandModal :brand="brand" @update="updateBrand" :show="showEditModal"
                            @close="showEditModal = false" />
                        <deleteCarBrandModal :brand="brand" @delete="deleteBrand" :show="showDeleteModal"
                            @close="showDeleteModal = false" />
                        <createCarBrandModal @create="createBrand" @close="showCreateModal = false"
                            :show="showCreateModal" />
</template>

<style scoped>
.brand-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0px 30px;
    gap: 20px;
}

h1 {
    text-align: center;
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

.card {
    border-radius: 10px;
    width: 300px;
    box-shadow: rgba(54, 66, 87, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
}

.brand-info {
    text-wrap: wrap;
    word-break: break-all;
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
        /* box-shadow: 0px 0px 100px var(--primary); */
    }
}

@media screen and (max-width: 400px) {
    .card {
        width: 280px;
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