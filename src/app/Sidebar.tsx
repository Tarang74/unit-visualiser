import React from 'react';
import transitionEvent from './transitionEvent';

import './Sidebar.scss';

export interface SidebarComponent {
    sidebarOpen: Boolean;
    sidebar: HTMLElement;
    sidebarButton: HTMLElement;
    changeState(self: SidebarComponent): void;
    closeSidebar(self: SidebarComponent): void;
    openSidebar(self: SidebarComponent): void;
}

export class SidebarComponent {
    constructor(sidebar: HTMLElement, sidebarButton: HTMLElement) {
        this.sidebarOpen = false;
        this.sidebar = sidebar;
        this.sidebarButton = sidebarButton;

        this.sidebarButton.addEventListener('click', () => {
            this.changeState();
        });
    }

    changeState() {
        if (!this.sidebarOpen) {
            this.sidebar.classList.remove('sidebar-closed');
            this.sidebar.classList.add('sidebar-opened');
            // Wait for transition to end
            this.sidebar.addEventListener(
                transitionEvent(this.sidebar), () => {
                    this.openSidebar();
                }
            );
        } else {
            this.sidebar.classList.remove('sidebar-opened');
            this.sidebar.classList.add('sidebar-closed');
            // Wait for transition to end
            this.sidebar.addEventListener(
                transitionEvent(this.sidebar), () => {
                    this.closeSidebar();
                }
            );
        }
    }

    closeSidebar() {
        this.sidebarButton.classList.remove('sidebar-btn-opened');
        this.sidebarButton.classList.add('sidebar-btn-closed');
        this.sidebarOpen = false;
    }

    openSidebar() {
        this.sidebarButton.classList.add('sidebar-btn-opened');
        this.sidebarButton.classList.remove('sidebar-btn-closed');
        this.sidebarOpen = true;
    }
}

export default function Sidebar() {
    return (
        <nav
            id="sidebar"
            className="fixed h-screen w-80 top-0 bg-blue-600 sidebar-closed"
        >
            <div
                id="sidebar-btn"
                className="sidebar-btn-closed absolute top-8 -right-8 w-8 h-8 cursor-pointer bg-transparent"
            >
                {/* <ArrowRight /> */}
                <img
                    id="sidebar-btn-icon"
                    className="h-full w-full"
                    src="images/arrow_right.svg"
                />
            </div>
            <div
                className="flex flex-col justify-start items-center gap-6 p-8 h-full"
                // style="overflow: overlay"
            >
                <div>
                    <h1 className="font-bold text-4xl text-white">
                        Unit Visualiser
                    </h1>
                </div>
                {/* Select Units */}
                <div id="select-units-container" className="w-full">
                    <label
                        className="text-left text-lg text-gray-100 w-full"
                        htmlFor="select-units"
                    >
                        Select Units:
                    </label>
                    <input
                        id="select-units"
                        className="w-full p-2 rounded-md text-gray-900 bg-slate-100 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:text-black"
                        type="text"
                        name="select-units"
                    />
                    <div className="mt-2 absolute rounded-md left-8 right-8 overflow-hidden bg-gray-100 border-1 border-solid border-slate-700 border-opacity-20 shadow-gray-300">
                        <ul
                            id="select-options"
                            className="select-options-ul p-2 max-h-48"
                        ></ul>
                    </div>
                </div>
                {/* Displayed Units */}
                <div className="w-full">
                    <div className="text-left text-lg text-gray-100 w-full">
                        Displayed Units:
                    </div>
                    <div className="h-32 overflow-y-auto"></div>
                </div>
                {/* Units Description */}
                <div className="w-full">
                    <div className="text-left text-lg text-gray-100 w-full">
                        Unit Description:
                    </div>
                    <div className="h-32">
                        Name: <br />
                        Faculty: <br />
                        School: <br />
                        Name: <br />
                    </div>
                </div>
                {/* Unit Prerequisites */}
                <div className="w-full">
                    <div className="text-left text-lg text-gray-100 w-full">
                        Prerequisites:
                    </div>
                    <div className="h-32 overflow-y-auto">
                        Name: <br />
                        Faculty: <br />
                        School: <br />
                        Name: <br />
                    </div>
                </div>
            </div>
        </nav>
    );
}
