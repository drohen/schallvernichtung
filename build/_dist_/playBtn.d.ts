import { RedomComponent } from "redom";
export interface PlayHandler {
    onPlay: () => Promise<void>;
    onPause: () => Promise<void>;
}
export declare class PlayBtn implements RedomComponent {
    private handler;
    el: HTMLButtonElement;
    private state;
    constructor(handler: PlayHandler);
    private playBtnEvent;
    pause(): void;
}
//# sourceMappingURL=playBtn.d.ts.map