import transitionEvent from '@functions/transitionEvent';

import classnames, {
    alignItems,
    backgroundColor,
    borderRadius,
    cursor,
    display,
    flexDirection,
    fontSize,
    fontWeight,
    gap,
    height,
    inset,
    justifyContent,
    margin,
    maxHeight,
    overflow,
    padding,
    position,
    textAlign,
    textColor,
    width
} from '@assets/tailwindcss-classnames';

import './styles.scss';

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
        this.sidebar = sidebar;
        this.sidebarButton = sidebarButton;

        this.sidebar.classList.add('sidebar-closed');
        this.closeSidebar();

        this.sidebarButton.addEventListener('click', () => {
            this.changeState();
        });
    }

    changeState() {
        if (!this.sidebarOpen) {
            this.sidebar.classList.remove('sidebar-closed');
            this.sidebar.classList.add('sidebar-opened');

            // Wait for transition to end
            let t = transitionEvent(this.sidebar);
            if (t) {
                this.sidebar.addEventListener(t, () => {
                    this.openSidebar();
                });
            }
        } else {
            this.sidebar.classList.remove('sidebar-opened');
            this.sidebar.classList.add('sidebar-closed');

            // Wait for transition to end
            let t = transitionEvent(this.sidebar);
            if (t) {
                this.sidebar.addEventListener(t, () => {
                    this.closeSidebar();
                });
            }
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
            className={classnames(
                position('fixed'),
                height('h-screen'),
                width('w-80'),
                inset('top-0'),
                backgroundColor('bg-blue-600')
            )}
        >
            <div
                id="sidebar-btn"
                className={
                    classnames(
                        position('absolute'),
                        inset('top-8'),
                        width('w-8'),
                        height('h-8'),
                        cursor('cursor-pointer'),
                        backgroundColor('bg-transparent')
                    ) + ' -right-8'
                }
            >
                {/* <ArrowRight /> */}
                <img
                    id="sidebar-btn-icon"
                    className={classnames(height('h-full'), width('w-full'))}
                />
            </div>
            <div
                className={classnames(
                    display('flex'),
                    flexDirection('flex-col'),
                    justifyContent('justify-start'),
                    alignItems('items-center'),
                    gap('gap-6'),
                    padding('p-8'),
                    height('h-full'),
                    overflow('overflow-y-auto')
                )}
            >
                <h1
                    className={classnames(
                        fontWeight('font-bold'),
                        fontSize('text-4xl'),
                        textColor('text-white')
                    )}
                >
                    Unit Visualiser
                </h1>

                {/* Select Units */}
                <div
                    id="select-units-container"
                    className={classnames(width('w-full'))}
                >
                    <label
                        className={classnames(
                            textAlign('text-left'),
                            fontSize('text-lg'),
                            textColor('text-gray-100'),
                            width('w-full')
                        )}
                        htmlFor="select-units"
                    >
                        Select Units:
                    </label>
                    <input
                        id="select-units"
                        className={classnames(
                            width('w-full'),
                            padding('p-2'),
                            borderRadius('rounded-md'),
                            textColor('text-gray-900'),
                            backgroundColor(
                                'bg-slate-100',
                                'hover:bg-slate-50',
                                'focus-visible:bg-slate-50'
                            ),
                            textColor('focus-visible:text-black')
                        )}
                        type="text"
                        name="select-units"
                    />
                    <div
                        id="select-options-container"
                        className={classnames(
                            margin('mt-2'),
                            position('absolute'),
                            borderRadius('rounded-md'),
                            inset('left-8', 'right-8'),
                            overflow('overflow-hidden'),
                            backgroundColor('bg-gray-100')
                        )}
                    >
                        <ul
                            id="select-options"
                            className={classnames(
                                padding('p-2'),
                                maxHeight('max-h-48')
                            )}
                        ></ul>
                    </div>
                </div>
                {/* Displayed Units */}
                <div
                    id="displayed-units-container"
                    className={classnames(width('w-full'))}
                ></div>
                {/* Units Description
                <div className={classnames(width('w-full'))}>
                    <div
                        className={classnames(
                            textAlign('text-left'),
                            fontSize('text-lg'),
                            textColor('text-gray-100'),
                            width('w-full')
                        )}
                    >
                        Unit Description:
                    </div>
                    <div className={classnames(height('h-32'))}>
                        Name: <br />
                        Faculty: <br />
                        School: <br />
                        Name: <br />
                    </div>
                </div> */}
                {/* Unit Prerequisites
                <div className={classnames(width('w-full'))}>
                    <div
                        className={classnames(
                            textAlign('text-left'),
                            fontSize('text-lg'),
                            textColor('text-gray-100'),
                            width('w-full')
                        )}
                    >
                        Prerequisites:
                    </div>
                </div> */}
            </div>
        </nav>
    );
}
