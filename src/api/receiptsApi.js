import { BASE_URL } from "../settings"

export const getReceipts = async (leadId) => {
    const response = await fetch(`${BASE_URL}/bazon-sale/${leadId}/receipts`)
    return (await response.json())
}

export const receiptState = async (leadId, receiptId) => {
    const response = await fetch(`${BASE_URL}/bazon-sale/${leadId}/receipt/${receiptId}`)
    return await response.json()
}

export const generateReceiptRequest = async (leadId, factoryNumber) => {
    const response = await fetch(`${BASE_URL}/bazon-sale/${leadId}/receipt-gen`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                factory_number: factoryNumber
            })
        }
    )
    return await response.json()
}

export const getCashMachines = async (leadId) => {
    return await (await fetch(`${BASE_URL}/bazon-sale/${leadId}/cash-machines`)).json()
}

export const createReceipt = async (leadId,
    factoryNumber,
    cashMachine,
    contact,
    cash,
    electron
) => {
    const body = JSON.stringify({
        "factory_number": factoryNumber,
        "cash_machine": cashMachine,
        contact,
        cash,
        electron
    })
    const response = await fetch(`${BASE_URL}/bazon-sale/${leadId}/receipt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    return await response.json()
}