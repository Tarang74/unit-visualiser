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

    addUnitsToSelection(n: number): void;
    removeUnitsFromSelection(unit: number): void;

    getUnitPrerequisites(unitIndices: Array<number>): Array<UnitPrerequisite>;
    findPrerequisitesRecursively(
        unitIndices: Array<number>,
        data: Array<Array<number | Array<number>>>
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
                                this.addUnitsToSelection(parseInt(element.id));
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

    addUnitsToSelection(n: number) {
        this.selectedUnits.push(n);
        this.closeOptions();
    }

    removeUnitsFromSelection(n: number) {
        this.selectedUnits.splice(this.selectedUnits.indexOf(n));
    }

    getUnitPrerequisites(unitIndices: Array<number>): Array<UnitPrerequisite> {
        let recursiveIndices = this.findPrerequisitesRecursively(unitIndices);

        // Use indices to find nodes (and children)
        var recursiveUnits: Array<UnitPrerequisite> = [];

        recursiveIndices.forEach((value) => {
            recursiveUnits.push({
                id: value,
                code: UNIT_CODES[value],
                prerequisites: UNIT_PREREQUISITES[value]
            });
        });

        return recursiveUnits;
    }

    findPrerequisitesRecursively(
        unitIndices: Array<number>,
        data: Array<Array<number | Array<number>>> = UNIT_PREREQUISITE_INDICES
    ): Set<number> {
        let output: Set<number> = new Set<number>([]);

        unitIndices.forEach((value) => {
            output.add(value);
        });

        unitIndices.forEach((selection) => {
            data[selection].forEach((prereq) => {
                if (typeof prereq === 'number') {
                    if (!output.has(prereq)) {
                        let recursive = this.findPrerequisitesRecursively(
                            [prereq],
                            data
                        );
                        recursive.forEach((value2) => {
                            output.add(value2);
                        });
                    }
                } else {
                    prereq.forEach((value1) => {
                        if (!output.has(value1)) {
                            let recursive = this.findPrerequisitesRecursively(
                                [value1],
                                data
                            );
                            recursive.forEach((value2) => {
                                output.add(value2);
                            });
                        }
                    });
                }
            });
        });

        return output;
    }
}

export function getUnitInfo(indices: Set<number>): Array<UnitInfo> {
    var output: Array<UnitInfo> = [];

    indices.forEach((indexValue) => {
        output.push({
            id: indexValue,
            code: UNIT_CODES[indexValue],
            name: UNIT_NAMES[indexValue],
            creditPoints: UNIT_CREDIT_POINTS[indexValue]
        });
    });

    return output;
}
