import {Sorter} from "./Sorter.js"
import {InfinityTableEffect} from "./InfinityTableEffect.js";

export class SheetsPadEngine {
    static _instance
    constructor() {
        if (SheetsPadEngine._instance !== undefined) return SheetsPadEngine._instance
        SheetsPadEngine._instance = this

        new Sorter()
        new InfinityTableEffect()
    }
}