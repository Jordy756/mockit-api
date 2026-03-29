export class AIResponse {

    public readonly data: Record<string, unknown>[];

    constructor(data: Record<string, unknown>[]) {
        this.data = data;
    }
}