import React from 'react';
import all from "../components/all";
import ComponentRegistry from "../registry/component-registry";

const registry = new ComponentRegistry(all);

export default {
    renderComponent(component, data, path) {
        if (component) {
            const Component = registry.get(component.type);
            return (
                <Component {...component} data={data} path={path} />
            );
        }
    },
    renderComponents(components, data, path) {
        return components.map((component, i) => {
            const Component = registry.get(component.type);
            return (
                <Component {...component} data={data} path={path} key={i} />
            );
        });
    },
    renderComponentsWith(components, data, path, renderCallback, refs = false, errors = {}) {

        return components.map((component, i) => {

            let ref = (refs ? React.createRef() : null);
            let Component = registry.get(component.type);
            let rendered = renderCallback(<Component {...component} data={data} errors={errors} path={path} ref={ref} />, i);

            return {
                component: rendered,
                ref: ref
            };
        });
    }
};
