import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { KeyObject } from 'node:crypto';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);
document.onkeyup = function (e) {
	if (e.key == "/") {
		var elements = document.querySelectorAll("input[data-controlType='search']");
		if (elements.length > 0) {
			var element = elements[elements.length - 1] as HTMLInputElement;
			element.focus();
		}
	}
	else if (e.keyCode >= 37 && e.keyCode <= 40) {
		var selectedRow = document.querySelector('tr.selected');
		document.querySelector('table')?.classList.remove('table-hover');
		if (selectedRow != null) {
			let previousElement = selectedRow;
			let nextElement;
			if (e.keyCode == 37 || e.keyCode == 38)
				nextElement = previousElement.previousElementSibling ?? document.querySelector('table>tbody tr:last-child');
			else
				nextElement = previousElement.nextElementSibling ?? document.querySelector('table>tbody tr:first-child');
			previousElement.classList.remove('selected')
			nextElement?.classList.add('selected')
		}
		else {
			const firstElement = document.querySelector("table>tbody tr:first-child");
			firstElement?.classList.add("selected");
		}
	}
}
document.onmousemove = function (e) {
    document.querySelector('tr.selected')?.classList.remove('selected')
	document.querySelector('table')?.classList.add('table-hover');
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
