import data from './parsed_data2022.json';

export interface UnitOptions {
    units: Array<string>;
    prerequisites: Array<Array<Array<string> | string>>;
    selectedUnits: Array<number>;
    ul: HTMLElement;
    updateOptions(select: HTMLInputElement):Promise<Boolean|string>;
    checkForScroll();
    clearOptions();
    openOptions();
    closeOptions();
    addUnitsToSelection(s: number);
    removeUnitFromSelection(unit: number);
    getUnitData(): Unit[];
}

export class UnitOptions {
    constructor() {
        // Units and corresponding prerequisites
        this.units = [];
        this.prerequisites = [];

        data.Units.forEach((value, index, array) => {
            this.units.push(value.unit_code);
            this.prerequisites.push(value.prerequisites);
        });

        this.selectedUnits = [];

        // Options list
        this.ul = document.getElementById('select-options');

        // Initialise ul
        this.closeOptions();
    }

    updateOptions(select: HTMLInputElement):Promise<Boolean> {
        return new Promise((resolve, reject) => {
            this.checkForScroll();

            var input: string = select.value.toUpperCase();

            if (input != '') {
                let hidden: number = 0;
                let visible: Array<number> = [];

                this.openOptions();

                for (let i = 0; i < this.units.length; i++) {
                    if (this.units[i].indexOf(input) > -1) {
                        visible.push(i);
                    } else {
                        hidden++;
                    }
                }

                if (hidden == this.units.length) {
                    // No units found
                    this.closeOptions();
                    resolve(false);
                } else {
                    let li: Array<HTMLElement> = [];
                    for (let i = 0; i < visible.length; i++) {
                        let a1: HTMLAnchorElement = document.createElement('a');
                        a1.textContent = this.units[visible[i]];

                        let a2: HTMLAnchorElement = document.createElement('a');
                        a2.textContent = 'Unit Name';

                        let div: HTMLDivElement = document.createElement('div');
                        div.appendChild(a1);
                        div.appendChild(a2);

                        li[i] = document.createElement('li');
                        li[i].id = visible[i].toString();
                        li[i].appendChild(div);

                        this.ul.appendChild(li[i]);
                    }

                    li.forEach((element) => {
                        element.addEventListener(
                            'click',
                            () => {
                                this.addUnitsToSelection(
                                    element.id as unknown as number
                                );
                                resolve(true);
                            },
                            true
                        );

                        document.addEventListener('click', () => {
                            this.closeOptions();
                            resolve(false);
                        });
                    });
                }
            } else {
                this.closeOptions();
                reject("No input provided.");
            }
        });

    }

    checkForScroll() {
        let selectContainer = document.getElementById('select-units-container');
        let dim = selectContainer.getBoundingClientRect();
        let top = dim.y + dim.height;

        this.ul.parentElement.style.top = `${top.toString()}px`;
    }

    clearOptions() {
        while (this.ul.firstChild) this.ul.removeChild(this.ul.firstChild);
    }

    openOptions() {
        this.clearOptions();
        this.ul.style.display = '';
    }

    closeOptions() {
        this.clearOptions();
        this.ul.style.display = 'none';
    }

    addUnitsToSelection(s: number) {
        this.selectedUnits.push(s);
        this.closeOptions();
    }

    removeUnitFromSelection(unit: number) {
        this.selectedUnits.splice(this.selectedUnits.indexOf(unit));
    }

    getUnitData(): Unit[] {
        // Use indices to find nodes (and children)
        var recursiveUnits: Unit[] = [];
        for (let i = 0; i < this.selectedUnits.length; i++) {
            recursiveUnits.push([
                this.units[this.selectedUnits[i]],
                this.prerequisites[this.selectedUnits[i]]
            ]);
        }
        return recursiveUnits;
    }
}
