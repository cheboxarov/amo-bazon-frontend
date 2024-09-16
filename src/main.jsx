import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getPipelineLeads } from "./Utils/PipelineUtils";
import PipelineMarker from "./Components/PipelineMarker/PipelineMarker";
import { getBazonDeals } from "./HttpService/HttpClient";
import {BASE_URL} from "./settings";
import store from "./state";
import DealWindow from "./Components/DealWindow/DealWindow";

const Widget = {
	render(self) {
		console.log("render bazon")
		const AvaliableWindows = ["leads", "leads-pipeline"];
		if (!AvaliableWindows.includes(window.AMOCRM.data.current_entity)) return;

		if (window.AMOCRM.data.current_entity === "leads") {
			store.updateCurrentDeal().then();
			let productsField = document.querySelector(`[data-id="1263491"]`); // tech
			//let productsField = document.querySelector(`[data-id="1264434"]`); // kontrabaz
			if (!productsField)
				return;
			const mainElement = document.createElement('div');
			productsField.replaceWith(mainElement);
			mainElement.setAttribute('class', 'tema_bazon_widget');
			store.setRenderDeal(() => {
				ReactDOM.createRoot(mainElement).render(
					<React.StrictMode>
						<DealWindow store={store} />
					</React.StrictMode>
				);
			})
			store.renderDeal()
		} else if (window.AMOCRM.data.current_entity === "leads-pipeline") {

			const renderLeadsPipeline = () => {

				if (!Array.isArray(leads)) {
					console.error("getPipelineLeads did not return an array");
					return;
				}

				getBazonDeals(leads).then(bazonDeals => {
					console.log(bazonDeals);
					bazonDeals.forEach((bazonDeal) => {
						let leadItem = document.querySelector(`[data-id="${bazonDeal.amo_lead_id}"]`);

						if (!leadItem) {
							console.warn(`Lead item with ID ${bazonDeal.amo_lead_id} not found`);
							return;
						}

						const pipelineElement = document.createElement("div");
						pipelineElement.setAttribute("class", "bazon_tag");
						const tagsField = leadItem.getElementsByClassName("pipeline_leads__tag pipeline_leads__tag-add")[0]; // Получаем первый элемент с классом

						if (tagsField) {
							if (tagsField.getElementsByClassName("bazon_tag").length === 0) {
								tagsField.appendChild(pipelineElement); // Добавляем новый элемент в tagsField
							}
						} else {
							console.warn("Tags field not found");
						}

						console.log(`Rendering PipelineMarker for lead ID: ${bazonDeal.amo_lead_id}`);

						ReactDOM.createRoot(pipelineElement).render(
							<React.StrictMode>
								<PipelineMarker />
							</React.StrictMode>
						);
					});
				});
			};

			let leads = getPipelineLeads();
			let lastLength = leads.length;
			renderLeadsPipeline();

			const leadsSearching = () => {
				const intervalId = setInterval(() => {
					if (window.AMOCRM.data.current_entity !== "leads-pipeline") {
						clearInterval(intervalId); // Останавливаем поиск, если текущая сущность больше не является "leads-pipeline"
						return;
					}

					leads = getPipelineLeads();
					const length = leads.length;

					if (lastLength !== length) {
						renderLeadsPipeline();
						lastLength = length;
					}
				}, 1000); // Проверяем каждые 1 секунду
			};

			leadsSearching();


		}

		return true;
	},
	init() {
		return true;
	},
	bind_actions() {
		return true;
	},
	settings() {
		return true;
	},
	onSave() {
		return true;
	},
	destroy() {
		return true;
	},
};

export default Widget;
