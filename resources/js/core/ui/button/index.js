import './index.scss';

import React from 'react';
import helpers from '../../../util/helpers';
import Icon from "../icon";

class Button extends React.Component {

    static defaultProps = {
        'label': '',
        'text': '',
        'type': 'button',
        'style': 'default',
        'icon': '',
        onClick: e => {},
        stopPropagation: true
    };

    onClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (this.props.stopPropagation) {
            e.stopPropagation();
        }
    }

    render() {

        let icon;

        if (this.props.icon) {
            icon = (
                <span className="button__icon">
                    <Icon style={'mini'} name={this.props.icon} />
                </span>
            );
        }

        let label = (this.props.label ? <span className={'button__label'}>{this.props.label}</span> : null);

        return (
            <button className={helpers.className('button', this.props.style)+' button--has-icon'} onClick={e => this.onClick(e)} type={this.props.type}>
                {icon}
                {label}
                {this.props.text}
            </button>
        );
    }
}

export default Button;
