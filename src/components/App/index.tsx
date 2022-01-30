import React from 'react';
import ReactDOM from 'react-dom';

import { getUnitInfo, UnitOptions } from '@services/unitSelection';
import * as d3 from 'd3';

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
    group: d3.Selection<SVGGElement, unknown, null, undefined>;
    nodes: d3.Selection<SVGGElement, unknown, null, undefined>;
    links: d3.Selection<SVGGElement, unknown, null, undefined>;

    width: number;
    height: number;
    displayedUnits: Array<number>;
    selectElement: HTMLInputElement;

    updateNodes(newNodes: Set<number>): void;

    removeChildrenFromElement(parent: HTMLElement): void;

    updateCanvas(
        nodeData: Array<NetworkNode>,
        linkData: Array<NetworkLink>
    ): void;

    findNodesRecursively(units: Array<UnitPrerequisite>): Array<UnitLink>;
    formatNode(
        unitLinks: Array<UnitLink>
    ): [Array<NetworkNode>, Array<NetworkLink>];

    updateVariables(container: HTMLElement): void;
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

        // Main group
        this.group = this.svg.append('g').attr('class', 'zoom-group');
        this.nodes = this.group.append('g').attr('class', 'nodes');

        this.updateVariables(container);
        window.onresize = () => {
            this.updateVariables(container);
        };

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
                        var allRequiredNodes =
                            unitSelector.getUnitPrerequisites(
                                unitSelector.selectedUnits
                            );

                        var [nodeData, linkData] = self.formatNode(
                            self.findNodesRecursively(allRequiredNodes)
                        );

                        self.updateNodes(
                            unitSelector.findPrerequisitesRecursively(
                                unitSelector.selectedUnits
                            )
                        );

                        console.log(nodeData);
                        console.log(linkData);

                        self.updateCanvas(nodeData, linkData);
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

    updateNodes(newNodes: Set<number>): void {
        let container = document.getElementById('displayed-units-container');
        if (!container) return;

        if (!newNodes) return this.removeChildrenFromElement(container);
        let nodeData = getUnitInfo(newNodes);

        console.log(nodeData);

        const Nodes = () => (
            <>
                {nodeData.map((value) => (
                    <li key={value.id} id={value.name}>
                        <div>
                            <a>{value.name}</a>
                            <a>{value.code}</a>
                        </div>
                        <div>{value.creditPoints}</div>
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
            </React.StrictMode>,
            container
        );
    }

    removeChildrenFromElement(parent: HTMLElement): void {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    updateCanvas(
        nodeData: Array<NetworkNode>,
        linkData: Array<NetworkLink>
    ): void {
        // // Simulation object
        // var simulation = d3.forceSimulation(
        //     data.nodes as d3.SimulationNodeDatum[]
        // );

        // // Forces
        // var chargeForce = d3.forceManyBody().strength(-400);
        // var centerForce = d3.forceCenter(this.width / 10, this.height / 10);
        // var linkForce = d3.forceLink(data.links).id((d: any) => d.name);

        // simulation
        //     .force('charge_force', chargeForce)
        //     .force('center_force', centerForce)
        //     .force('links', linkForce);

        // Node group
        var node = this.nodes.selectAll('.nodes').data(nodeData).enter();

        // node.append('g').attr(
        //     'transform',
        //     (d: any) => `translate(${d.x}, ${d.y})`
        // );

        // Node rect
        node.append('rect')
            .attr('class', 'node')
            .attr('height', 15)
            .style('fill', (d) => (d.group != undefined ? d.group : 'blue'));

        // Node text
        node.append('text')
            // .merge(node)
            .text((d) => d.code)
            .style('font-size', '12px')
            .attr('dy', '1em');

        node.attr(
            'width',
            20
            // (d) => this.childNodes[1].getComputedTextLength() + 20
        );

        // // Link line
        // var link = g
        //     .append('g')
        //     .attr('class', 'link')
        //     .selectAll('.links')
        //     .data(data.links)
        //     .enter();
        // link.append('line')
        //     .attr('class', 'link')
        //     .attr('marker-end', 'url(#arrowhead)');

        // // Global events
        // var dragHandler = d3.drag<SVGElement, SimulationNodeDatum>();

        // dragHandler
        //     .on('start', (event: any, d: SimulationNodeDatum) => {
        //         if (!event.active) simulation.alphaTarget(0.3).restart();
        //         d.fx = d.x;
        //         d.fy = d.y;
        //     })
        //     .on('drag', (event: any, d: SimulationNodeDatum) => {
        //         d.fx = event.x;
        //         d.fy = event.y;
        //     })
        //     .on('end', (event: any, d: SimulationNodeDatum) => {
        //         if (!event.active) simulation.alphaTarget(0);
        //         d.fx = null;
        //         d.fy = null;
        //     });

        // dragHandler(node);

        // var zoomHandler = d3
        //     .zoom()
        //     .on('zoom', (event) => g.attr('transform', event.transform))
        //     .scaleExtent([0.5, 7]);
        // zoomHandler(this.svg);

        // // Initialise simulation
        // simulation.on('tick', () => {
        //     node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

        //     link.attr('x1', (d: any) => d.source.x)
        //         .attr('y1', (d: any) => d.source.y)
        //         .attr('x2', (d: any) => d.target.x)
        //         .attr('y2', (d: any) => d.target.y);
        // });

        node.exit().remove();
    }

    findNodesRecursively(units: Array<UnitPrerequisite>): Array<UnitLink> {
        // Find all child nodes from 1-depth list of (node, child) pairs
        // (where child nodes may reference other top-level nodes)

        var nodes: Array<UnitLink> = [];

        units.forEach((unit, index) => {
            /* Append root node */
            nodes.push({
                id: unit.id,
                code: unit.code,
                parent: index,
                disjunctionGroup: -1
            });

            unit.prerequisites.forEach((prereq, index2) => {
                // Disjunction
                let newNode: string;
                if (typeof prereq[index2] == 'object') {
                    // Conjunction
                    let lenK: number = prereq[index2].length;
                    for (let k = 0; k < lenK; k++) {
                        newNode = prereq[index2][k];
                        nodes.indexOf({
                            id: unit.id,
                            code: newNode,
                            parent: index,
                            disjunctionGroup: index2
                        }) === -1
                            ? nodes.push({
                                  id: unit.id,
                                  code: newNode,
                                  parent: index,
                                  disjunctionGroup: index2
                              })
                            : {};
                    }
                } else if (typeof prereq[index2] == 'string') {
                    // String literal
                    newNode = prereq[index2];
                    nodes.indexOf({
                        id: unit.id,
                        code: newNode,
                        parent: index,
                        disjunctionGroup: index2
                    }) === -1
                        ? nodes.push({
                              id: unit.id,
                              code: newNode,
                              parent: index,
                              disjunctionGroup: index2
                          })
                        : {};
                }
            });
        });

        return nodes;
    }

    formatNode(
        unitLinks: Array<UnitLink>
    ): [Array<NetworkNode>, Array<NetworkLink>] {
        var networkNodes: Array<NetworkNode> = [];
        var networkLinks: Array<NetworkLink> = [];

        var currentHeadIndex = -1;
        var currentHead = '';

        unitLinks.forEach((unitLink) => {
            networkNodes.map((e) => e.code).indexOf(unitLink.code) === -1
                ? networkNodes.push({ id: unitLink.id, code: unitLink.code })
                : {};
            if (unitLink.parent != currentHeadIndex) {
                // Head node
                currentHead = unitLink.code;
                currentHeadIndex++;
            } else {
                // Children of head node
                networkLinks.push({
                    id: unitLink.id,
                    source: currentHead,
                    target: unitLink.code,
                    group: unitLink.disjunctionGroup
                });
            }
        });

        return [networkNodes, networkLinks];
    }

    updateVariables(container: HTMLElement): void {
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg.attr('height', this.height).attr('width', this.width);
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
