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
            },
            paySources: [],
            paidSources: {},
            sources: [],
            storages: [],
            managers: {},
            contractor: null,
            contractors: [],
        },
        error: null
    },

    setError(error) {
        this.state.error = error
    },

    async createContractor(data) {
        const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/contractor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const response_json = await response.json()
        const contractorID = response_json.response.setContractor.Contractor.id
        this.state.currentDeal.dealDetails.contractorID = contractorID
        await this.fetchDealEdit()
        this.updateCurrentDeal()
    },

    async getContractors() {
        const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/contractors`)
        if (response.status != 200) {
            return
        }
        const response_json = await response.json()
        this.state.currentDeal.contractors = response_json.response[0].result.contractors
    },

    async getContractor() {
        console.log("Кидаю запрос на получение контрагента")
        const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/contractor`)
        console.log(`Получен ответ ${response.status}`)
        if (response.status != 200) {
            return
        }
        const response_json = await response.json()
        this.state.currentDeal.contractor = response_json.response.getContractor.Contractor
    },

    async fetchDealEdit() {
        await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.currentDeal.dealDetails)
        })
    },

    async fetchSubInfo() {
        await Promise.all([
            this.fetchStorages(),
            this.fetchManagers(),
            this.fetchSources()
        ])
        this.renderDeal()
    },

    async createDeal(body) {
        const response = await fetch(`${BASE_URL}/create-sale-document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...body,
                amoLeadId: this.state.currentDeal.dealId
            })
        })
        if (response.ok) {
            await this.updateCurrentDeal()
        }
    },

    async fetchManagers() {
        const response = await fetch(`${BASE_URL}/managers`)
        if (response.ok) {
            this.state.currentDeal.managers = await response.json()
        }
    },

    async fetchSources() {
        const response = await fetch(`${BASE_URL}/sources`)
        if (response.ok) {
            this.state.currentDeal.sources = await response.json()
        }
    },

    async fetchStorages() {
        const response = await fetch(`${BASE_URL}/storages`)
        if (response.ok) {
            this.state.currentDeal.storages = await response.json()
        }
    },

    async fetchPaidSources() {
        const dealId = this.state.currentDeal.dealId
        const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/get-paid-sources`)
        if (response.ok) {
            this.state.currentDeal.paidSources = await response.json()
        }
    },

    async fetchPaySources() {
        const dealId = this.state.currentDeal.dealId
        const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/get-pay-sources`)
        if (response.ok) {
            this.state.currentDeal.paySources = await response.json()
        }
    },

    async dealPayBack(amount, source) {
        const dealId = this.state.currentDeal.dealId
        try {
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/pay-back`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pay_source: source,
                    pay_sum: amount,
                })
            })
            if (response.ok) {
                await this.updateCurrentDeal()
            } else {
                console.error(response.errored)
            }
        } catch (error) {
            console.log(error)
        }
    },

    async addDealPay(amount, source, comment) {
        const dealId = this.state.currentDeal.dealId
        try {
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/add-pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pay_source: source,
                    pay_sum: amount,
                    comment: comment
                })
            })
            if (response.ok) {
                await this.updateCurrentDeal()
            } else {
                console.error(response.errored)
            }
        } catch (error) {
            console.log(error)
        }
    },

    async moveDeal(state) {
        try {
            this.setDealLoading(true)
            const dealId = this.state.currentDeal.dealId
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/move`, {
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
                this.setDealLoading(false)
            }
        } catch (e) {
            console.error(e)
            this.setDealLoading(false)
        }
    },

    async issueDeal() {
        await this.moveDeal("issue")
    },

    async reserveDeal() {
        await this.moveDeal("reserve")
    },

    async recreateDeal() {
        await this.moveDeal("recreate")
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
        await this.updateCurrentDeal();
        this.closeProductsWindow();
    },

    async updateProductsWindow(search = null) {
        this.setProductsLoading(true);
        try {
            const subUrl = window.AMOCRM.constant('account').subdomain;
            let response = null;
            response = await fetch(`${BASE_URL}/bazon-items/${subUrl}?storage_id=${this.state.currentDeal.dealDetails.storageID}`);
            if (response.ok) {
                let products = await response.json();
    
                if (search) {
                    products = products.filter(product =>
                        product.name.toLowerCase().includes(search.toLowerCase())
                    );
                }
    
                this.state.currentDeal.productsWindow.products = products;
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
            notesWrapper.style.display = 'none';
        }
        this.updateProductsWindow().then(() => {
            this.renderDeal()
        })
    },

    closeProductsWindow() {
        this.state.currentDeal.productsWindow.isOpen = false
        const notesWrapper = document.querySelector('.notes-wrapper');
        if (notesWrapper) {
            notesWrapper.style.display = '';
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
        this.state.currentDeal.dealDetails = null
        this.state.currentDeal.dealProducts = []
        try {
            this.state.currentDeal.dealId = window.AMOCRM.data.current_card.id; // Получаем ID сделки
            const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/detail`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                this.state.currentDeal.dealDetails = data.document.Document;
                this.setDealProducts(data.items);
                const tasks = [
                    this.fetchOrders(),
                    this.fetchPaySources(),
                    this.getContractor(),
                    this.getContractors()
                ]
                if (this.state.currentDeal.dealDetails.paid !== 0)
                    tasks.push(this.fetchPaidSources())
                await Promise.all(tasks)
            } else {
                await this.fetchSubInfo()
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
    },

    async getPrintForm() {
        const response = await fetch(`${BASE_URL}/bazon-sale/${this.state.currentDeal.dealId}/print-form`)
        if (response.ok) {
            return await response.json()
        }
        return null
    }

};

window.store = store;

export default store;
