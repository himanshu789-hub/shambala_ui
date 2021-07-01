import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);
document.onkeydown = function (e) {
	if (e.key == "/") {
		var elements = document.querySelectorAll("input[data-controltype='search']");
		if (elements.length > 0) {
			var element = elements[elements.length - 1] as HTMLInputElement;
			element.focus();
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
