import { EventName } from '../../node_modules/@lit/react/index.js';
import { MButton as MButtonElement } from '../components/m-button/m-button';
import { MButtonClickDetail } from '../index';
export declare const MButton: import('../../node_modules/@lit/react/index.js').ReactWebComponent<MButtonElement, {
    onMButtonClick: EventName<CustomEvent<MButtonClickDetail>>;
}>;
