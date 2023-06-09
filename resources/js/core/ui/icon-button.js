import React from 'react';
import helpers from '../../util/helpers';
import Icon from "./icon";

class IconButton extends React.Component {

    static defaultProps = {
        name: 'fingerprint',
        style: '',
        iconStyle: 'default',
        onClick: e => {},
        stopPropagation: true
    };

    onClick(e) {
        if (this.props.stopPropagation) {
            e.stopPropagation();
        }
        this.props.onClick(e);
    }

    render() {
        return (
            <button className={helpers.className('icon-button', this.props.style)} onClick={e => this.onClick(e)} type={'button'}>
                <Icon
                    name={this.props.name}
                    style={this.props.iconStyle}
                />
            </button>
        );
    }
}

export default IconButton;
