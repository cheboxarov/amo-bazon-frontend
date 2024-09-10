import {BASE_URL} from "./settings";

const store = {

    state: {
        currentDeal: {
            dealId: null,
            dealDetails: null,
            productsWindow: {
                isLoading: false,
                isOpen: false,
                products: [],
                error: null
            },
            dealProducts: [],
            isDealLoading: false,
            dealError: null,
            orders: {
                isOrdersLoading: false,
                entitys: [],
                error: null
            }
        }
    },

    async moveDeal(state) {
        try {
            const dealId = this.state.currentDeal.dealId
            const response = await fetch(`https://wlovem.ru/amo-bazon/bazon-sale/${dealId}/move`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "state": state
                })
            })
            if (response.ok) {
                await this.updateCurrentDeal()
            } else {
                console.log(response.errored)
            }
        } catch (e) {
            console.error(e)
        }
    },

    async giveDeal() {
        console.log("Give Deal", this.state.currentDeal);
    },

    async reserveDeal() {
        await this.moveDeal("reserve")
    },

    async cancelDeal() {
        await this.moveDeal("cancel")
    },

    async fetchOrders() {
        this.setOrdersLoading(true);
        try {
            const dealId = window.AMOCRM.data.current_card.id;
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/orders`); // Ваш API для получения чеков
            if (!response.ok) {
                console.error(response.errored);
            }
            this.state.currentDeal.orders.entitys = await response.json(); // Установка чеков в состояние
        } catch (error) {
            console.error('Ошибка:', error);
            this.state.currentDeal.orders.error = error.message;
        } finally {
            this.setOrdersLoading(false);
        }
    },

    setOrdersLoading(state) {
        this.state.currentDeal.orders.isLoading = state;
        this.renderDeal()
    },

    async saveDealProducts(quantities, initialQuantities, onProgress) {
        const dealId = this.state.currentDeal.dealId;
        const storageId = this.state.currentDeal.dealDetails.storageID;
        const itemsToUpdate = Object.keys(quantities)
            .filter(id => quantities[id] > 0 && quantities[id] !== initialQuantities[id]);

        for (let i = 0; i < itemsToUpdate.length; i++) {
            const id = itemsToUpdate[i];
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/add-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dealId: dealId,
                    items: [
                        {
                            storageId: storageId,
                            productId: id,
                            quantity: quantities[id],
                        }
                    ],
                }),
            });

            if (response.ok && onProgress) {
                onProgress(((i + 1) / itemsToUpdate.length) * 100); // обновляем прогресс через callback
            }
        }

        this.closeProductsWindow();
        await this.updateCurrentDeal();
    },

    async updateProductsWindow(search = null) {
        this.setProductsLoading(true);
        try {
            const subUrl = window.AMOCRM.constant('account').subdomain
            let response = null;
            if (search) {
                response = await fetch(`${BASE_URL}/bazon-items/${subUrl}?search=${search}`)
            } else {
                response = await fetch(`${BASE_URL}/bazon-items/${subUrl}?storage_id=${this.state.currentDeal.dealDetails.storageID}`)
            }
            if (response.ok) {
                this.state.currentDeal.productsWindow.products = await response.json();
            } else {
                console.error(response);
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setProductsLoading(false);
        }
    },

    openProductsWindow() {
        this.state.currentDeal.productsWindow.isOpen = true
        const notesWrapper = document.querySelector('.notes-wrapper');
        if (notesWrapper) {
            notesWrapper.style.display = 'none'; // Скрываем элемент
        }
        this.updateProductsWindow().then(() => {
            this.renderDeal()
        })
    },

    closeProductsWindow() {
        this.state.currentDeal.productsWindow.isOpen = false
        const notesWrapper = document.querySelector('.notes-wrapper');
        if (notesWrapper) {
            notesWrapper.style.display = ''; // Восстанавливаем элемент
        }
        this.renderDeal()
    },

    setProductsLoading(state) {
        this.state.currentDeal.productsWindow.isLoading = state;
        this.renderDeal()
    },

    setDealProducts(products) {
        this.state.currentDeal.dealProducts = products;
        this.renderDeal()
    },

    setDealLoading(state) {
        this.state.currentDeal.isDealLoading = state;
        this.renderDeal()
    },

    setDealError(error) {
        this.state.currentDeal.dealError = error;
        this.renderDeal()
    },

    async updateCurrentDeal() {
        this.setDealLoading(true);
        try {
            this.state.currentDeal.dealId = window.AMOCRM.data.current_card.id; // Получаем ID сделки
            const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/detail`);

            if (response.ok) {
                const data = await response.json();
                this.state.currentDeal.dealDetails = data.document.Document;
                this.setDealProducts(data.items);
                await this.fetchOrders()
            } else {
                this.setDealError('Ошибка при загрузке сделки');
            }
        } catch (error) {
            this.setDealError(`Ошибка: ${error.message}`);
        } finally {
            this.setDealLoading(false);
        }
    },

    renderDeal() {
        console.log("Default renderer")
    },

    setRenderDeal(render) {
        this.renderDeal = render;
    }

};

window.store = store;

export default store;
