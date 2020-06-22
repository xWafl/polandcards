export class GameResponse {
    constructor(public status: boolean, public reason?: string) {}

    public toString() {
        return status ? `Success` : `Game Error — ${this.reason}`;
    }
}
