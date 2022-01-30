import { UnitOptions } from '@services/unitSelection';
import setEquals from '@testing/setEquals';

let a = new UnitOptions();
test('[findUnitsRecursively] Outputs correctly for unit with no prerequisite.', () => {
    let data = [[], []];

    let received = a.findPrerequisitesRecursively([1], data);
    let expected = new Set<number>([1]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with single prerequisite.', () => {
    let data = [[], [0]];

    let received = a.findPrerequisitesRecursively([1], data);
    let expected = new Set<number>([0, 1]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions.', () => {
    let data = [[], [0], [0, 1]];

    let received = a.findPrerequisitesRecursively([2], data);
    let expected = new Set<number>([0, 1, 2]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions containing conjunctions.', () => {
    let data = [[], [0], [], [[2], [0, 1]]];

    let received = a.findPrerequisitesRecursively([3], data);
    let expected = new Set<number>([0, 1, 2, 3]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for multiple units with single prerequisite.', () => {
    let data = [[], [0], [], [2], [3], [4]];

    let received = a.findPrerequisitesRecursively([1, 5], data);
    let expected = new Set<number>([0, 1, 2, 3, 4, 5]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for multiple units with multiple prerequisites as disjunctions.', () => {
    let data = [[], [0], [0, 1], [], [3], [], [1, 4]];

    let received = a.findPrerequisitesRecursively([1, 2, 6], data);
    let expected = new Set<number>([0, 1, 2, 3, 4, 6]);

    expect(setEquals(received, expected)).toBeTruthy();
});

test('[findUnitsRecursively] Outputs correctly for unit with multiple prerequisites as disjunctions containing conjunctions.', () => {
    let data = [[], [0], [], [[2], [0, 1]], [3, [0, 1, 2]]];

    let received = a.findPrerequisitesRecursively([3, 4], data);
    let expected = new Set<number>([0, 1, 2, 3, 4]);

    expect(setEquals(received, expected)).toBeTruthy();
});
