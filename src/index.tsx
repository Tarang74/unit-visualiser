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

const p = new Promise((resolve) => {
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
        document.getElementById('main-root'),
        () => resolve(true)
    );
});

function main() {
    const img = document.getElementById('d3-logo');
    if (img) (img as HTMLImageElement).src = d3Logo;

    const sidebar = document.getElementById('sidebar');
    const sidebarBtn = document.getElementById('sidebar-btn');

    if (sidebar && sidebarBtn) new SidebarComponent(sidebar, sidebarBtn);

    const img2 = document.getElementById('sidebar-btn-icon');
    if (img2) (img2 as HTMLImageElement).src = arrowIcon;

    new Canvas('#app');
}

p.then(main);
