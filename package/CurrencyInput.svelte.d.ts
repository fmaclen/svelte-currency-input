import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        value?: number | undefined;
        locale?: string | undefined;
        currency?: string | undefined;
        name?: string | undefined;
        required?: boolean | undefined;
        disabled?: boolean | undefined;
        isNegativeAllowed?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CurrencyInputProps = typeof __propDef.props;
export declare type CurrencyInputEvents = typeof __propDef.events;
export declare type CurrencyInputSlots = typeof __propDef.slots;
export default class CurrencyInput extends SvelteComponentTyped<CurrencyInputProps, CurrencyInputEvents, CurrencyInputSlots> {
}
export {};
