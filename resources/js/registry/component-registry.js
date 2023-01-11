"use strict";

export default class ComponentRegistry {
    constructor(components = {}) {
        this.components = components;
    }

    get(type) {
        return this.components[type] || null;
    }
}
