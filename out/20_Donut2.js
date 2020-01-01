{
    class Map {
        constructor(equality) {
            this.values = [];
            this.equality = equality;
        }
        get(key) {
            const found = this.values.filter(it => this.equality(key, it[0]))[0];
            if (found == null)
                return null;
            return found[1];
        }
        delete(key) {
            this.values = this.values.filter(it => !this.equality(it[0], key));
        }
        set(key, value) {
            this.delete(key);
            this.values.push([key, value]);
        }
        forEach(func) {
            this.values.forEach(it => func(it[1], it[0]));
        }
    }
    const input = '{"ZZO":{"FDI":2},"FDO":{"REO":4},"REO":{"FDO":4},"FDI":{"ZZO":2},"REI":{"AAO":2},"AAO":{"REI":2}}';
    const stringMatrix = JSON.parse(input);
    function areSamePortal(portal1, portal2) {
        return (portal1.identifier === portal2.identifier &&
            portal1.location === portal2.location);
    }
    function areSameLayeredPortal(layeredPortal1, layeredPortal2) {
        return (areSamePortal(layeredPortal1.portal, layeredPortal2.portal) &&
            layeredPortal1.layer === layeredPortal2.layer);
    }
    const matrix = new Map(areSamePortal);
    for (const aPortalString in stringMatrix) {
        const mapA = new Map(areSamePortal);
        const portalA = {
            identifier: aPortalString.slice(0, 2),
            location: aPortalString[2]
        };
        matrix.set(portalA, mapA);
        for (const bPortalString in stringMatrix[aPortalString]) {
            const distance = stringMatrix[aPortalString][bPortalString];
            const portalB = {
                identifier: bPortalString.slice(0, 2),
                location: bPortalString[2]
            };
            mapA.set(portalB, distance);
        }
    }
    // console.log(matrix);
    const visited = new Map(areSameLayeredPortal); // nodes we already know shorted path to
    const seen = new Map(areSameLayeredPortal); // nodes we know a path to
    const target = {
        portal: { identifier: "ZZ", location: "O" },
        layer: 0
    };
    seen.set({ portal: { identifier: "AA", location: "O" }, layer: 0 }, 0);
    while (true) {
        let minDistance = null;
        let chosenPortal = null;
        seen.forEach((distance, portal) => {
            if (minDistance === null || distance < minDistance) {
                minDistance = distance;
                chosenPortal = portal;
            }
        });
        visited.set(chosenPortal, minDistance);
        seen.delete(chosenPortal);
        console.log(chosenPortal, minDistance);
        if (areSameLayeredPortal(chosenPortal, target)) {
            console.log(minDistance);
            break;
        }
        const connected = getConnected(chosenPortal);
        console.log(connected, 444);
        connected.forEach((distance, portal) => {
            const currentDistance = seen.get(portal);
            const newDistance = distance + minDistance;
            console.log(visited.get(portal), 333);
            if (
            // visited.get(portal) != null && // CAUSES ERROR
            currentDistance == null ||
                currentDistance > newDistance) {
                seen.set(portal, newDistance);
            }
        });
    }
    function getConnected(from) {
        let connected = matrix.get(from.portal);
        if (connected == null)
            connected = new Map(areSamePortal);
        const distances = new Map(areSameLayeredPortal);
        connected.forEach((distance, to) => {
            const layeredPortal = { portal: to, layer: from.layer };
            distances.set(layeredPortal, distance);
        });
        if (from.portal.identifier === "AA" || from.portal.identifier === "ZZ") {
            return distances;
        }
        if (from.portal.location === "I") {
            distances.set({
                portal: { identifier: from.portal.identifier, location: "O" },
                layer: from.layer - 1
            }, 1);
        }
        else {
            distances.set({
                portal: { identifier: from.portal.identifier, location: "I" },
                layer: from.layer + 1
            }, 1);
        }
        return distances;
    }
}
