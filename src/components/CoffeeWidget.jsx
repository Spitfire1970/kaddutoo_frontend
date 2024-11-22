import { useEffect } from "react";

export default function Buymeacoffee() {
	useEffect(() => {
		const script = document.createElement("script");
		const div = document.getElementById("supportByBMC");
		script.setAttribute("data-name", "BMC-Widget");
		script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
		script.setAttribute("data-id", "ngoyal7019t");
		script.setAttribute("data-description", "Support me on Buy me a coffee!");
		script.setAttribute(
			"data-message",
			"support my techy shenanigans (anything counts)",
		);
		script.setAttribute("data-color", "#26b0a1");
		script.setAttribute("data-position", "Right");
		script.setAttribute("data-x_margin", "18");
		script.setAttribute("data-y_margin", "18");
		script.async = true;
		document.head.appendChild(script);
		script.onload = function () {
			var evt = document.createEvent("Event");
			evt.initEvent("DOMContentLoaded", false, false);
			window.dispatchEvent(evt);
		};

		div.appendChild(script);
	}, []);

	return <div id="supportByBMC"></div>;
}