import JestInstance from '@services/JestInstance';

import {
    UNIT_CODES,
    UNIT_CREDIT_POINTS,
    UNIT_NAMES,
    UNIT_PREREQUISITES,
    UNIT_PREREQUISITE_INDICES,
    UNIT_STUDY_AREAS,
    TOTAL_UNITS
} from '@assets/data/Unit Data';

export interface UnitOptions {
    selectedUnits: Array<number>;
    ul: HTMLElement;
    updateOptions(s: string): Promise<Boolean>;
    checkForScroll(): void;
    clearOptions(): void;
    openOptions(): void;
    closeOptions(): void;
    addUnitsToSelection(s: number): void;
    removeUnitFromSelection(unit: number): void;
    getUnitPrerequisites(unitIndices: Array<number>): Array<Unit>;
    findUnitsRecursively(
        unitIndices: Array<number>,
        data?: Array<Array<number | Array<number>>>
    ): Set<number>;
}

export class UnitOptions {
    constructor() {
        if (JestInstance()) return;
        this.selectedUnits = [];

        // Options list
        this.ul = document.getElementById('select-options')!;

        // Initialise ul
        this.closeOptions();
    }

    updateOptions(s: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            this.checkForScroll();

            if (s == '') {
                this.closeOptions();
                reject('No input provided.');
            } else {
                var input: string = s.toUpperCase();

                let hidden: number = 0;
                let visible: Array<number> = [];

                this.openOptions();

                for (let i = 0; i < TOTAL_UNITS; i++) {
                    if (
                        UNIT_CODES[i].includes(input) ||
                        UNIT_NAMES[i].toUpperCase().includes(input)
                    ) {
                        visible.push(i);
                    } else {
                        hidden++;
                    }
                }

                if (hidden == TOTAL_UNITS) {
                    // No matches found
                    this.closeOptions();
                    resolve(false);
                } else {
                    let li: Array<HTMLElement> = [];
                    visible.forEach((value, index) => {
                        let a1: HTMLAnchorElement = document.createElement('a');
                        a1.textContent = UNIT_CODES[value];

                        let a2: HTMLAnchorElement = document.createElement('a');
                        a2.textContent = UNIT_NAMES[value];

                        let div: HTMLDivElement = document.createElement('div');
                        div.appendChild(a1);
                        div.appendChild(a2);

                        li[index] = document.createElement('li');
                        li[index].id = value.toString();
                        li[index].appendChild(div);

                        this.ul.appendChild(li[index]);
                    });

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
            }
        });
    }

    checkForScroll() {
        let selectContainer = document.getElementById(
            'select-units-container'
        )!;
        let dim = selectContainer.getBoundingClientRect();
        let top = dim.y + dim.height;

        this.ul.parentElement!.style.top = `${top.toString()}px`;
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

    getUnitPrerequisites(unitIndices: Array<number>): Array<Unit> {
        let recursiveIndices = this.findUnitsRecursively(unitIndices);

        // Use indices to find nodes (and children)
        var recursiveUnits: Array<Unit> = [];

        for (let i = 0; i < unitIndices.length; i++) {
            recursiveUnits.push([
                UNIT_CODES[unitIndices[i]],
                UNIT_PREREQUISITES[unitIndices[i]]
            ]);
        }
        return recursiveUnits;
    }

    findUnitsRecursively(
        unitIndices: Array<number>,
        data?: Array<Array<number | Array<number>>>
    ): Set<number> {
        if (!data) data = UNIT_PREREQUISITE_INDICES;
        let output: Set<number> = new Set<number>([]);
        unitIndices.forEach((value) => {
            output.add(value);
        });

        for (let i = 0; i < unitIndices.length; i++) {
            data[unitIndices[i]].forEach((value) => {
                if (typeof value === 'number') {
                    output.add(value);
                } else {
                    value.forEach((value1) => {
                        output.add(value1);
                    });
                }
            });
        }

        return output;
    }
}

export function getUnitData(
    indices: Array<number>
): Array<[string, string, number]> {
    var output: Array<[string, string, number]> = [];

    indices.forEach((value) => {
        output.push([
            UNIT_CODES[value],
            UNIT_NAMES[value],
            UNIT_CREDIT_POINTS[value]
        ]);
    });

    return output;
}
