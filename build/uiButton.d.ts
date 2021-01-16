import { RedomComponent } from "redom";
export interface ButtonInteractionHandler {
    onDown?: (state: string) => void;
    onUp?: (state: string) => void;
    onLeave?: (state: string) => void;
    onClick?: (state: string) => void;
}
export declare enum ButtonCTA {
    tap = 0,
    hold = 1
}
export declare class UIButton implements RedomComponent {
    private handler;
    private _stateLabels;
    private buttonCTA;
    private state;
    private touchTimeout;
    private touchState;
    private button;
    private label;
    private stateLabels;
    el: HTMLDivElement;
    constructor(handler: ButtonInteractionHandler, _stateLabels: {
        [state: string]: string;
    }, buttonCTA: ButtonCTA, initialState: string);
    private setButtonText;
    private touchEnd;
    private touchHold;
    private touchStart;
    private onUp;
    private onClick;
    private onDown;
    private onLeave;
    setState(state: string): void;
    setCTA(state: ButtonCTA): void;
    enable(): void;
    disable(): void;
}
//# sourceMappingURL=uiButton.d.ts.map