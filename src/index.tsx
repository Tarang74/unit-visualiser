import React from 'react';
import ReactDOM from 'react-dom';

import App, { Canvas } from './app/App';
import Sidebar, { SidebarComponent } from './app/Sidebar';

import './index.scss';

let p = new Promise((resolve) => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
            <Sidebar />
            <img
                src="images/d3_js.svg"
                className="d3-logo absolute opacity-40 bottom-2 right-2"
                draggable="false"
                alt="d3 JS"
            />
        </React.StrictMode>,
        document.getElementById('main-root')
    );

    resolve(true);
});

function main() {
    new SidebarComponent(
        document.getElementById('sidebar'),
        document.getElementById('sidebar-btn')
    );

    new Canvas(document.getElementById('app'));
}

p.then(main);

if (import.meta.env.NODE_ENV != 'production') {
    if (import.meta.hot) {
        import.meta.hot.accept();
    }
}
