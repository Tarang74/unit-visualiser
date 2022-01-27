export default function setEquals(setA: Set<number>, setB: Set<number>): boolean {
    if (setA.size !== setB.size) {
        return false;
    }

    for (const a of setA) {
        if (!setB.has(a)) {
            return false;
        }
    }
    
    return true;
};
