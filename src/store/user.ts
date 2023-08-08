import { defineStore } from 'pinia'
import { arrayToTree } from '../utils/transform'
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: {},
            menus: [],
        }
    },
    getters: {
        getMenu(state) {
            return arrayToTree(state.menus)
        }
    },
    actions: {
        setMenu() {
            
        }
    }
})