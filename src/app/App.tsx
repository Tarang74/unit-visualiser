import React from 'react';

import { UnitOptions } from './unit_select';
import * as d3 from 'd3';
import { D3DragEvent, SimulationNodeDatum, SubjectPosition } from 'd3';

import './App.scss';

export interface Canvas {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    width: number;
    height: number;
    selectElement: HTMLInputElement;
    output: NetworkNode;
    updateCanvas(json: NetworkNode): void;
    findNodesRecursively(l: Unit[]): Array<[string, number, number]>;
}

export class Canvas {
    constructor(container: HTMLElement) {
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg = d3
            .select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, 20, 20])
            .attr('refX', 10)
            .attr('refY', 10)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto-start-reverse')
            .append('line');

        this.selectElement = document.getElementById(
            'select-units'
        ) as HTMLInputElement;

        let unitSelector = new UnitOptions();

        var self = this;

        const selection = () => {
            if (self.selectElement.value == '') {
                return;
            }
            
            unitSelector.updateOptions(this.selectElement).then(
                (resolveValue) => {
                    if (resolveValue) {
                        var requiredNodes: Unit[] = [];
                        requiredNodes = unitSelector.getUnitData();
                        self.output = self.formatNode(
                            self.findNodesRecursively(requiredNodes)
                        );

                        console.log(self.output);
                        self.updateCanvas(self.output);
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

    updateCanvas(json: NetworkNode) {
        // Simulation object
        var simulation = d3.forceSimulation(
            json.nodes as d3.SimulationNodeDatum[]
        );

        // Forces
        var chargeForce = d3.forceManyBody().strength(-200);
        var centerForce = d3.forceCenter(this.width / 2, this.height / 2);
        var linkForce = d3.forceLink(json.links).id((d: any) => d.name);

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
            .data(json.nodes)
            .enter()
            .append('g')
            .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

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
            .attr('class', 'links')
            .selectAll('.links')
            .data(json.links)
            .enter()
            .append('line')
            .attr('class', 'disjunctive-group')
            .attr('marker-start', 'url(#arrow)')
            .attr('fill', 'none');

        // Global events
        var dragHandler = d3
            .drag()
            .on(
                'start',
                (
                    event: D3DragEvent<
                        SVGSVGElement,
                        SimulationNodeDatum,
                        SubjectPosition
                    >,
                    d: d3.SimulationNodeDatum
                ) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
            )
            .on(
                'drag',
                (
                    event: D3DragEvent<
                        SVGSVGElement,
                        SimulationNodeDatum,
                        SubjectPosition
                    >,
                    d: d3.SimulationNodeDatum
                ) => {
                    d.fx = event.x;
                    d.fy = event.y;
                }
            )
            .on(
                'end',
                (
                    event: D3DragEvent<
                        SVGSVGElement,
                        SimulationNodeDatum,
                        SubjectPosition
                    >,
                    d: d3.SimulationNodeDatum
                ) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
            );
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
            className="app flex justify-center items-center bg-slate-100 w-screen h-screen"
        ></div>
    );
}
