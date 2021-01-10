import { RedomComponent } from "redom";
export interface ButtonInteractionHandler {
    onDown?: (state: string) => void;
    onUp?: (state: string) => void;
    onLeave?: (state: string) => void;
    onClick?: (state: string) => void;
}
export declare class UIButton implements RedomComponent {
    private handler;
    private stateLabels;
    private state;
    private touchTimeout;
    private touchState;
    el: HTMLButtonElement;
    constructor(handler: ButtonInteractionHandler, stateLabels: {
        [state: string]: string;
    }, initialState: string);
    private touchEnd;
    private touchHold;
    private touchStart;
    private onUp;
    private onClick;
    private onDown;
    private onLeave;
    setState(state: string): void;
    enable(): void;
    disable(): void;
}
//# sourceMappingURL=uiButton.d.ts.map