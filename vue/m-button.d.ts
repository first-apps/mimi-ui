import { PropType } from 'vue';
import { MButtonClickDetail, MButtonSize, MButtonType, MButtonVariant } from '../components/m-button/m-button';
export declare const MButton: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    variant: {
        type: PropType<MButtonVariant>;
        default: string;
    };
    size: {
        type: PropType<MButtonSize>;
        default: string;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: PropType<MButtonType>;
        default: string;
    };
    name: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: StringConstructor;
        default: string;
    };
}>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    click: (_e: MouseEvent) => true;
    'm-button-click': (_e: CustomEvent<MButtonClickDetail>) => true;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    variant: {
        type: PropType<MButtonVariant>;
        default: string;
    };
    size: {
        type: PropType<MButtonSize>;
        default: string;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: PropType<MButtonType>;
        default: string;
    };
    name: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    onClick?: ((_e: MouseEvent) => any) | undefined;
    "onM-button-click"?: ((_e: CustomEvent<MButtonClickDetail>) => any) | undefined;
}>, {
    type: MButtonType;
    variant: MButtonVariant;
    size: MButtonSize;
    disabled: boolean;
    loading: boolean;
    name: string;
    value: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
