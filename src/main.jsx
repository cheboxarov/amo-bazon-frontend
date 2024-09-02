import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getPipelineLeads } from "./Utils/PipelineUtils";
import PipelineMarker from "./Components/PipelineMarker/PipelineMarker";
import { getBazonDeals } from "./HttpService/HttpClient";
import {BASE_URL} from "./settings";

const Widget = {
	render(self) {
		const AvaliableWindows = ["leads", "leads-pipeline"];
		if (!AvaliableWindows.includes(window.AMOCRM.data.current_entity)) return;

		let productsField = document.querySelector(`[data-id="1263491"]`);
		if (productsField) {
			const mainElement = document.createElement('div');
			productsField.replaceWith(mainElement);
			mainElement.setAttribute('class', 'tema_bazon_widget');

			ReactDOM.createRoot(mainElement).render(
				<React.StrictMode>
					<App widget={self} />
				</React.StrictMode>
			);
		} else if (window.AMOCRM.data.current_entity === "leads-pipeline") {
			let leads = getPipelineLeads();

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
					pipelineElement.setAttribute("class", "bazon_tag")
					const tagsField = leadItem.getElementsByClassName("pipeline_leads__tag pipeline_leads__tag-add")[0]; // Получаем первый элемент с классом

					if (tagsField) {
						if(tagsField.getElementsByClassName("bazon_tag").length === 0)
							tagsField.appendChild(pipelineElement); // Добавляем новый элемент в tagsField
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
