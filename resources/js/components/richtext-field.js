import React from 'react';
import Field from "../core/ui/field";
import Trix from 'trix';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";
import file from "../util/file";

export default class RichtextField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        tooltip: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            redrawKey: 0,
            value: this.props.data[this.props.name] || ''
        };
    }

    handleEditorReady(editor) {

        Trix.config.textAttributes.sup = {tagName: 'sup', inheritable: false};

        let toolbarEl = editor.element.editorController.toolbarController.element;
        let buttonHTML = '<button type="button" data-trix-attribute="sup" class="trix-button">A<sup>2</sup></button>';

        let buttonGroupEl = toolbarEl.querySelector('.trix-button-group');
        if (buttonGroupEl) {
            buttonGroupEl.insertAdjacentHTML('beforeend', buttonHTML);
        }
        let blockToolsEl = toolbarEl.querySelector('.trix-button-group--block-tools');
        if (blockToolsEl) {
            blockToolsEl.remove();
        }
        let fileToolsEl = toolbarEl.querySelector('.trix-button-group--file-tools');
        if (fileToolsEl) {
            fileToolsEl.remove();
        }
    }

    componentDidMount() {
        //
    }

    componentWillUnmount() {
        //
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                redrawKey: this.state.redrawKey + 1,
                value: this.props.data[this.props.name] || ''
            });
        }
    }

    handleChange(html, text) {
        this.setState({
            value: html
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value || '';
    }

    getData(data) {
        data[this.props.name] = this.state.value || '';
        return data;
    }

    render() {
        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                tooltip={this.props.tooltip}
            >
                <div className="richtext-field">
                    <TrixEditor
                        key={this.state.redrawKey}
                        value={this.props.data[this.props.name] || ''}
                        onChange={this.handleChange.bind(this)}
                        onEditorReady={this.handleEditorReady.bind(this)}
                    />
                </div>
            </Field>
        );
    }
}
