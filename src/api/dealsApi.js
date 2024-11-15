import {BASE_URL} from "../settings";


const getBazonDeals = async (leadIds) => {
    let body = {
        lead_ids: leadIds
    };

    try {
        const response = await fetch(`${BASE_URL}/bazon-sales`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', // Указываем, что данные будут отправлены в формате JSON
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой');
        }

        const data = await response.json();
        return data; // Возвращаем данные

    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export {getBazonDeals}