import React from 'react';
import ReactDOM from 'react-dom';

import App, { Canvas } from '@components/App';
import Sidebar, { SidebarComponent } from '@components/Sidebar';

import classnames, {
    inset,
    opacity,
    position
} from 'types/tailwindcss-classnames';

import '@assets/styles/index.scss';

let p = new Promise((resolve) => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
            <Sidebar />
            <img
                src="./assets/images/d3_js.svg"
                id="d3-logo"
                className={classnames(
                    position('absolute'),
                    opacity('opacity-40'),
                    inset('bottom-2', 'right-2')
                )}
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
        document.getElementById('sidebar')!,
        document.getElementById('sidebar-btn')!
    );

    new Canvas(document.getElementById('app')!);
}

p.then(main);