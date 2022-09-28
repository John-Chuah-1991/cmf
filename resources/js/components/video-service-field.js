import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";
import IconButton from "../core/ui/icon-button";

export default class VideoServiceField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        videoServiceField: '',
        tooltip: '',
        errors: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            videoServiceValue: ''
        };
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.data[this.props.name] !== prevProps.data[this.props.name] ||
            this.props.data[this.props.videoServiceField] !== prevProps.data[this.props.videoServiceField]
        ) {
            this.setState({
                value: this.props.data[this.props.name],
                videoServiceValue: this.props.data[this.props.videoServiceField]
            });
        }
    }

    handleChange(e) {

        let value = e.target.value;

        let re = /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
        let parts = value.match(re);
        let id = value;

        if (parts) {
            id = parts[8] || value;
        }

        this.setState({
            value: id,
            videoServiceValue: ( id ? 'youtube' : '' )
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value || '';
        data[this.props.videoServiceField] = this.state.videoServiceValue || '';
    }

    renderPreview() {

        if (! this.state.videoServiceValue || ! this.state.value) {
            return null;
        }

        return (
            <div className="video-service-field__preview">
                <div className="video-service-field__service">
                    {this.state.videoServiceValue}
                </div>
                <div className="video-service-field__thumbnail">
                    <img src={'https://i3.ytimg.com/vi/'+this.state.value+'/maxresdefault.jpg'} alt={this.state.videoServiceValue} />
                </div>
            </div>
        )
    }

    render() {
        return (
            <Field
                name={this.props.name}
                required={this.props.showRequiredIndicator}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <div className="video-service-field">
                    <input
                        id={dom.inputId(this.props.name)}
                        name={this.props.name}
                        className={'video-service-field__input'}
                        type={'text'}
                        value={this.state.value}
                        disabled={this.props.disabled}
                        onChange={this.handleChange.bind(this)}
                        onKeyUp={this.handleChange.bind(this)}
                    />
                    {this.renderPreview()}
                </div>
            </Field>
        );
    }
}
