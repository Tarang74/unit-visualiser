export default function transitionEvent(e: HTMLElement) {
    const transitions = new Map([
        ['transition', 'transitionend'],
        ['OTransition', 'oTransitionEnd'],
        ['MozTransition', 'transitionend'],
        ['WebkitTransition', 'webkitTransitionEnd']
    ] as const);

    for (const t of transitions.keys()) {
        if (e.style.getPropertyValue(t) !== undefined) {
            return transitions.get(t);
        }
    }
}
