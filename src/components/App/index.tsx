import React from 'react';
import ReactDOM from 'react-dom';

import { getUnitData, UnitOptions } from '@services/unitSelection';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';

import classnames, {
    alignItems,
    backgroundColor,
    display,
    fontSize,
    height,
    justifyContent,
    overflow,
    textAlign,
    textColor,
    width
} from '@assets/tailwindcss-classnames';

import './styles.scss';

export interface Canvas {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    width: number;
    height: number;
    displayedUnits: Array<number>;
    selectElement: HTMLInputElement;

    updateNodes(newNodes: Array<number>): void;
    removeChildNodes(parent: HTMLElement): void;
    updateCanvas(json: NetworkNode): void;
    findNodesRecursively(l: Unit[]): Array<[string, number, number]>;
}

export class Canvas {
    constructor(container: HTMLElement) {
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.displayedUnits = [];

        this.svg = d3
            .select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('class', 'arrowhead')
            .attr('viewBox', [0, -5, 10, 10])
            .attr('refX', 13)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('x-overflow', 'visible')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        let selectElement = document.getElementById('select-units');
        if (selectElement)
            this.selectElement = selectElement as HTMLInputElement;

        let unitSelector = new UnitOptions();

        var self = this;

        const selection = () => {
            if (self.selectElement.value == '') {
                return;
            }

            unitSelector.updateOptions(this.selectElement.value).then(
                (resolveValue) => {
                    if (resolveValue) {
                        var requiredNodes = unitSelector.getUnitPrerequisites(
                            unitSelector.selectedUnits
                        );

                        var output = self.formatNode(
                            self.findNodesRecursively(requiredNodes)
                        );

                        console.log(output);
                        self.updateNodes(unitSelector.selectedUnits);
                        self.updateCanvas(output);
                    }
                },
                (rejectValue) => {
                    console.log(rejectValue);
                }
            );
        };

        ['input', 'focus'].forEach((event) => {
            self.selectElement.addEventListener(event, selection);
        });
    }

    updateNodes(newNodes: Array<number>): void {
        let container = document.getElementById('displayed-units-container');
        if (!container) return;

        if (!newNodes) return this.removeChildNodes(container);
        let nodeData = getUnitData(newNodes);

        const Nodes = () => (
            <>
                {nodeData.map((value) => (
                    <li key={value[0]} id={value[0]}>
                        <div>
                            <a>{value[0]}</a>
                            <a>{value[1]}</a>
                        </div>
                        <div>{value[2]}</div>
                    </li>
                ))}
            </>
        );

        ReactDOM.render(
            <React.StrictMode>
                <div
                    className={classnames(
                        textAlign('text-left'),
                        fontSize('text-lg'),
                        textColor('text-gray-100'),
                        width('w-full')
                    )}
                >
                    Displayed Units:
                </div>
                <div
                    className={classnames(
                        height('h-32'),
                        overflow('overflow-y-auto')
                    )}
                >
                    <ul>
                        <Nodes />
                    </ul>
                </div>
                ,
            </React.StrictMode>,
            container
        );
    }

    removeChildNodes(parent: HTMLElement): void {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    updateCanvas(data: NetworkNode) {
        // Simulation object
        var simulation = d3.forceSimulation(
            data.nodes as d3.SimulationNodeDatum[]
        );

        // Forces
        var chargeForce = d3.forceManyBody().strength(-400);
        var centerForce = d3.forceCenter(this.width / 10, this.height / 10);
        var linkForce = d3.forceLink(data.links).id((d: any) => d.name);

        simulation
            .force('charge_force', chargeForce)
            .force('center_force', centerForce)
            .force('links', linkForce);

        // Main group
        var g = this.svg.append('g').attr('class', 'zoom-group');

        // Node group
        var node = g
            .append('g')
            .attr('class', 'nodes')
            .selectAll('.nodes')
            .data(data.nodes)
            .enter();

        node.append('g').attr(
            'transform',
            (d: any) => `translate(${d.x}, ${d.y})`
        );

        // Node rect
        node.append('rect')
            .attr('class', 'node')
            .attr('height', 15)
            .style('fill', (d) => (d.group != undefined ? d.group : 'blue'));

        // Node text
        node.append('text')
            .text((d) => d.name)
            .style('font-size', '12px')
            .attr('dy', '1em');

        node.attr(
            'width',
            20
            // (d) => this.childNodes[1].getComputedTextLength() + 20
        );

        // Link line
        var link = g
            .append('g')
            .attr('class', 'link')
            .selectAll('.links')
            .data(data.links)
            .enter();
        link.append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#arrowhead)');

        // Global events
        var dragHandler = d3.drag<SVGElement, SimulationNodeDatum>();

        dragHandler
            .on('start', (event: any, d: SimulationNodeDatum) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event: any, d: SimulationNodeDatum) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: any, d: SimulationNodeDatum) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        dragHandler(node);

        var zoomHandler = d3
            .zoom()
            .on('zoom', (event) => g.attr('transform', event.transform))
            .scaleExtent([0.5, 7]);
        zoomHandler(this.svg);

        // Initialise simulation
        simulation.on('tick', () => {
            node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

            link.attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);
        });
    }

    findNodesRecursively(l: Unit[]): Array<[string, number, number]> {
        // Find all child nodes from 1-depth list of (node, child) pairs
        // (where child nodes may reference other top-level nodes)

        var nodes: Array<[string, number, number]> = [];

        for (let i = 0; i < l.length; i++) {
            /* Append root node */
            nodes.push([l[i][0], i, -1]);

            let lenJ: number = l[i][1].length;
            for (let j = 0; j < lenJ; j++) {
                // Disjunction
                let newNode: string;
                if (typeof l[i][1][j] == 'object') {
                    // Conjunction
                    let lenK: number = l[i][1][j].length;
                    for (let k = 0; k < lenK; k++) {
                        newNode = l[i][1][j][k];
                        nodes.indexOf([newNode, i, j]) === -1
                            ? nodes.push([newNode, i, j])
                            : {};
                    }
                } else if (typeof l[i][1][j] == 'string') {
                    // String literal
                    newNode = l[i][1][j] as string;
                    nodes.indexOf([newNode, i, j]) === -1
                        ? nodes.push([newNode, i, j])
                        : {};
                }
            }
        }

        return nodes;
    }

    formatNode(l: Array<[string, number, number]>): NetworkNode {
        var network: NetworkNode = { nodes: [], links: [] };
        var currentHeadIndex = -1;
        var currentHead = '';

        l.forEach((element) => {
            network.nodes.map((e) => e.name).indexOf(element[0]) === -1
                ? network.nodes.push({ name: element[0] })
                : {};
            if (element[1] != currentHeadIndex) {
                // Head node
                currentHead = element[0];
                currentHeadIndex++;
            } else {
                // Children of head node
                network.links.push({
                    source: currentHead,
                    target: element[0],
                    group: element[2]
                });
            }
        });

        return network;
    }
}

export default function App() {
    return (
        <div
            id="app"
            className={classnames(
                display('flex'),
                justifyContent('justify-center'),
                alignItems('items-center'),
                backgroundColor('bg-slate-100'),
                width('w-screen'),
                height('h-screen')
            )}
        ></div>
    );
}
