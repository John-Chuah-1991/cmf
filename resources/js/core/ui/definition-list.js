"use strict";

import React from 'react';
import util from "./util";
import Icon from "./icon";
import i18n from "../../util/i18n";

export default class DefinitionList extends React.Component {

    static defaultProps = {
        data: [],
        onPropertyChange: (property, newValue) => {}
    };

    render() {
        return (
            <div className="definition-list">
                {this.props.data.map((item, i) => {

                    let isEditable = item[2] || false;

                    return (
                        <div
                            className={'definition-list__item'+(isEditable ? ' definition-list__item--editable' : '')}
                            key={i}
                            onClick={isEditable ? e => this.openEditPrompt(item[0], item[1]) : null}
                        >
                            <span className={'definition-list__key'}>
                                {i18n.get('snippets.'+item[0])}
                            </span>
                            <span className={'definition-list__value'}>
                                {(item[1] || (isEditable ? <Icon style={'mini'} name={'edit'} /> : '–'))}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    openEditPrompt(property, value) {
        util.prompt({
            title: i18n.get('snippets.'+property),
            defaultValue: value,
            confirm: newValue => this.props.onPropertyChange(property, newValue),
            confirmButtonText: i18n.get('snippets.save')
        });
    }
}
