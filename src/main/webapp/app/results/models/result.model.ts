export class Result {
    constructor(
        public initialVulnerability: Map<number, number>,
        public contextualVulnerability: Map<number, number>,
        public refinedVulnerability: Map<number, number>
    ) {
    }
}
