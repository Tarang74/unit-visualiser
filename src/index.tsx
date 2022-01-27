import React from 'react';
import ReactDOM from 'react-dom';

import App, { Canvas } from '@components/App';
import Sidebar, { SidebarComponent } from '@components/Sidebar';

import classnames, {
    inset,
    opacity,
    position
} from '@assets/tailwindcss-classnames';

import d3Logo from '@assets/icons/d3_js.svg';
import arrowIcon from '@assets/icons/arrow_right.svg';
import '@assets/styles/index.scss';

let p = new Promise((resolve) => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
            <Sidebar />
            <img
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
    let img = document.getElementById('d3-logo');
    if (img) (img as HTMLImageElement).src = d3Logo;

    let sidebar = document.getElementById('sidebar');
    let sidebarBtn = document.getElementById('sidebar-btn');

    if (sidebar && sidebarBtn) new SidebarComponent(sidebar, sidebarBtn);

    let img2 = document.getElementById('sidebar-btn-icon');
    if (img2) (img2 as HTMLImageElement).src = arrowIcon;

    let app = document.getElementById('app');
    if (app) new Canvas(app);
}

p.then(main);
