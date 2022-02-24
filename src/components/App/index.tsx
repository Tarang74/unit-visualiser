import React from 'react';
import ReactDOM from 'react-dom';

import { getUnitInfo, UnitOptions } from '@services/unitSelection';
import { UNIT_STUDY_AREAS } from '@assets/data/Unit Data';

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
import { NetworkNode, NetworkLink } from '@interfaces/index';
import { BaseType, D3DragEvent, D3ZoomEvent } from 'd3';

export interface Canvas {
    color: d3.ScaleOrdinal<string, string, never>;

    svg: d3.Selection<SVGSVGElement, NetworkNode, HTMLElement, unknown>;
    zoomGroup: d3.Selection<SVGGElement, NetworkNode, HTMLElement, unknown>;
    nodes: d3.Selection<SVGGElement, NetworkNode, HTMLElement, unknown>;
    links: d3.Selection<SVGGElement, NetworkNode, HTMLElement, unknown>;

    width: number;
    height: number;
    displayedUnits: Array<number>;
    selectElement: HTMLInputElement;

    updateNodes(newNodes: Set<number>): void;

    removeChildrenFromElement(parent: HTMLElement): void;

    updateCanvas(
        nodeData: Array<NetworkNode>,
        linkData: Array<NetworkLink>
    ): SVGSVGElement | null;

    findNodesRecursively(
        units: Array<UnitPrerequisite>
    ): Array<UnitPrerequisiteLink>;
    formatNode(
        unitLinks: Array<UnitPrerequisiteLink>
    ): [Array<NetworkNode>, Array<NetworkLink>];

    updateVariables(container: HTMLElement): void;
}

export class Canvas {
    constructor(selector: string) {
        const container = document.getElementById('app');
        if (!container) return;

        this.displayedUnits = [];

        const types = Array.from(new Set(UNIT_STUDY_AREAS));
        this.color = d3.scaleOrdinal(types, d3.schemeCategory10);

        this.svg = d3
            .select<SVGSVGElement, NetworkNode>(selector)
            .append('svg')
            .attr('class', 'graph')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .classed('svg-content', true);

        this.svg
            .append('defs')
            .selectAll('marker')
            .data(types)
            .join('marker')
            .attr('id', (d) => `arrow-${d}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 38)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('fill', this.color)
            .attr('d', 'M0,-5L10,0L0,5');

        this.zoomGroup = this.svg.append('g').attr('class', 'zoom-group');

        this.nodes = this.zoomGroup.append('g').attr('class', 'nodes');
        this.links = this.zoomGroup.append('g').attr('class', 'links');

        this.updateVariables(container);
        window.onresize = () => {
            this.updateVariables(container);
        };

        const selectElement = document.getElementById('select-units');
        if (selectElement)
            this.selectElement = selectElement as HTMLInputElement;

        const unitSelector = new UnitOptions();

        const self = this;

        const selection = () => {
            if (self.selectElement.value == '') {
                return;
            }

            unitSelector.updateOptions(this.selectElement.value).then(
                (resolveValue) => {
                    if (resolveValue) {
                        const recursiveNodes =
                            unitSelector.findPrerequisitesRecursively(
                                unitSelector.selectedUnits
                            );

                        self.updateNodes(recursiveNodes);

                        const nodePrerequisites =
                            unitSelector.getUnitPrerequisites(recursiveNodes);

                        const [nodeData, linkData] = self.formatNode(
                            self.findNodesRecursively(nodePrerequisites)
                        );

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
        const container = document.getElementById('displayed-units-container');
        if (!container) return;

        if (!newNodes) return this.removeChildrenFromElement(container);
        const nodeData = getUnitInfo(newNodes);

        const Nodes = () => (
            <>
                {nodeData.map((value) => (
                    <li key={value.id} id={value.name}>
                        <div>
                            <a>
                                {value.name !== ''
                                    ? value.name
                                    : 'Unit unavailable'}
                            </a>
                            <a>{value.code}</a>
                        </div>
                        <div>
                            {value.creditPoints !== 0
                                ? value.creditPoints
                                : 'N/A'}
                        </div>
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
                        height('h-48'),
                        overflow('overflow-y-auto')
                    )}
                >
                    <ul id="displayed-units">
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
    ): SVGSVGElement | null {
        console.log(nodeData);
        console.log(linkData);

        function drag() {
            // selection: d3.Selection<
            //     BaseType | SVGCircleElement,
            //     NetworkNode,
            //     SVGGElement,
            //     NetworkNode
            // >,
            // simulation: d3.Simulation<NetworkNode, NetworkLink>
            console.log(simulation);

            function dragStarted(
                event: D3DragEvent<SVGCircleElement, NetworkNode, unknown>,
                d: NetworkNode
            ) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(
                event: D3DragEvent<SVGCircleElement, NetworkNode, unknown>,
                d: NetworkNode
            ) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragEnded(
                event: D3DragEvent<SVGCircleElement, NetworkNode, unknown>,
                d: NetworkNode
            ) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3
                .drag<SVGCircleElement, NetworkNode>()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded);
        }

        const simulation = d3
            .forceSimulation<NetworkNode, NetworkLink>(nodeData)
            .force(
                'link',
                d3.forceLink<NetworkNode, NetworkLink>(linkData).id((d) => d.id)
            )
            .force('charge', d3.forceManyBody<NetworkNode>().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .force(
                'collide',
                d3.forceCollide(() => 65)
            );

        const link = this.links
            .selectAll('line')
            .data(linkData)
            .join('line')
            .attr('stroke', (d) => this.color(d.group.toString()));

        const node = this.nodes
            .selectAll('circle')
            .data(nodeData)
            .join('circle')
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
            .attr('r', 25)
            .attr('fill', () => '#6baed6')
            .call(drag);

        // node.append('text')
        //     .attr('x', 30 + 4)
        //     .attr('y', '0.31em')
        //     .text((d) => d.id)
        //     .lower()
        //     .attr('fill', 'none')
        //     .attr('stroke', 'white')
        //     .attr('stroke-width', 3);

        let lastK = 0;

        simulation.on('tick', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            link.attr('x1', (d: any) => d.source.x)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('y1', (d: any) => d.source.y)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('x2', (d: any) => d.target.x)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('y2', (d: any) => d.target.y);

            node.attr('cx', (d) => (d.x !== undefined ? d.x : null)).attr(
                'cy',
                (d) => (d.y !== undefined ? d.y : null)
            );
        });

        const zoomed = (event: D3ZoomEvent<SVGSVGElement, NetworkNode>) => {
            console.log(event);
            if (event.transform.k > 2 && lastK != event.transform.k) {
                lastK = event.transform.k;
            }
            this.zoomGroup.attr('transform', event.transform.toString());
        };

        this.svg.call(
            d3
                .zoom<SVGSVGElement, NetworkNode>()
                .extent([
                    [0, 0],
                    [this.width, this.height]
                ])
                .scaleExtent([1, 80])
                .on('zoom', zoomed)
        );

        return this.svg.node();

        // node.on('dblclick', (e, d) => console.log(d));
    }

    findNodesRecursively(
        units: Array<UnitPrerequisite>
    ): Array<UnitPrerequisiteLink> {
        // Find all child nodes from 1-depth list of (node, child) pairs
        // (where child nodes may reference other top-level nodes)

        const nodes: Array<UnitPrerequisiteLink> = [];

        units.forEach((unit, index) => {
            /* Append root node */
            nodes.push({
                id: unit.id,
                code: unit.code,
                study_area: unit.study_area,
                parent: index,
                disjunctionGroup: -1
            });

            unit.prerequisites.forEach((prereq, index2) => {
                // Disjunction
                if (typeof prereq === 'object') {
                    // Conjunction
                    prereq.forEach((conjunction) => {
                        nodes.indexOf({
                            id: unit.id,
                            code: conjunction,
                            study_area: unit.study_area,
                            parent: index,
                            disjunctionGroup: index2
                        }) === -1
                            ? nodes.push({
                                  id: unit.id,
                                  code: conjunction,
                                  study_area: unit.study_area,
                                  parent: index,
                                  disjunctionGroup: index2
                              })
                            : {};
                    });
                } else if (typeof prereq === 'string') {
                    // String literal
                    nodes.indexOf({
                        id: unit.id,
                        code: prereq,
                        study_area: unit.study_area,
                        parent: index,
                        disjunctionGroup: index2
                    }) === -1
                        ? nodes.push({
                              id: unit.id,
                              code: prereq,
                              study_area: unit.study_area,
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
        unitLinks: Array<UnitPrerequisiteLink>
    ): [Array<NetworkNode>, Array<NetworkLink>] {
        const networkNodes: Array<NetworkNode> = [];
        const networkLinks: Array<NetworkLink> = [];

        let currentHeadIndex = -1;
        let currentHead = '';

        unitLinks.forEach((unitLink) => {
            networkNodes.map((e) => e.id).indexOf(unitLink.code) === -1
                ? networkNodes.push({
                      id: unitLink.code,
                      group: unitLink.study_area
                  })
                : {};
            if (unitLink.parent != currentHeadIndex) {
                // Head node
                currentHead = unitLink.code;
                currentHeadIndex++;
            } else {
                // Children of head node
                networkLinks.push({
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
