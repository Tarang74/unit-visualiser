import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface NetworkNode extends SimulationNodeDatum {
    id: string;
    group: string;
}

export interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
    source: string;
    target: string;
    group: number;
}
