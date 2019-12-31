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
    const input = '{"SXO":{"ENI":56},"UYO":{"XII":56},"AAO":{"RUO":6,"KHI":50},"RUO":{"AAO":6,"KHI":54},"GTO":{"RFI":72},"VMO":{"XBI":48},"BYO":{"VMI":58},"LGO":{"WDI":52},"ENI":{"SXO":56},"XII":{"UYO":56},"KHI":{"AAO":50,"RUO":54},"RFI":{"GTO":72},"XBI":{"VMO":48},"VMI":{"BYO":58},"WDI":{"LGO":52},"UOI":{"HVO":80},"QAI":{"MBO":58,"ZZO":60},"MBO":{"QAI":58,"ZZO":8},"HVO":{"UOI":80},"ZZO":{"QAI":60,"MBO":8},"YXO":{"GTI":56},"GTI":{"YXO":56},"XIO":{"AOI":78},"AOI":{"XIO":78},"WDO":{"MBI":54},"AOO":{"PII":54},"MBI":{"WDO":54},"PII":{"AOO":54},"UYI":{"ZYO":48,"HVI":4,"OQO":52},"ZYO":{"UYI":48,"HVI":46,"OQO":6},"HVI":{"UYI":4,"ZYO":46,"OQO":50},"RUI":{"PIO":54},"PIO":{"RUI":54},"OQO":{"UYI":52,"ZYO":6,"HVI":50},"OQI":{"WAO":58},"WAO":{"OQI":58},"UOO":{"SXI":74},"SXI":{"UOO":74},"BYI":{"RFO":48},"WAI":{"KHO":52},"RFO":{"BYI":48},"TRI":{"XBO":44},"XBO":{"TRI":44},"KHO":{"WAI":52},"ZYI":{"MWO":54},"MWI":{"TRO":54},"YXI":{"PSO":52},"MDI":{"QAO":44},"PSI":{"MDO":50},"LGI":{"ENO":56},"MWO":{"ZYI":54},"TRO":{"MWI":54},"PSO":{"YXI":52},"QAO":{"MDI":44},"MDO":{"PSI":50},"ENO":{"LGI":56}}';
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
        connected.forEach((distance, portal) => {
            const currentDistance = seen.get(portal);
            const newDistance = distance + minDistance;
            if (currentDistance == null || currentDistance > newDistance) {
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
