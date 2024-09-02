const getPipelineLeads = () => {
    const leads = window.AMOCRM.data.current_view._items._byId
    if(!leads)
        return []
    return Object.values(leads).map((value) => {
        return value.id
    })
}

export {getPipelineLeads}