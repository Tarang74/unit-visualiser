export default function transitionEvent(e: HTMLElement) {
    var transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
    };

    let t;
    
    for (t in transitions) {
        if (e.style[t as any] !== undefined) {
            return transitions[t];
        }
    }
}
