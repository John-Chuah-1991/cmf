import React from 'react';
import Button from "./button";
import i18n from "../../util/i18n";

export default class Form extends React.Component {

    static defaultProps = {
        realForm: true,
        errors: {},
        submitButtonText: i18n.get('snippets.confirm'),
        sidebar: [],
        onSubmit: () => {}
    };

    constructor(props) {

        super(props);

        this.state = {
            isSubmitting: false
        };

        this.childRefs = [];
        this.sidebarRefs = [];

        if (! this.props.children.length && ! this.props.sidebar.length) {
            return;
        }

        if (this.props.children.length) {
            this.props.children.forEach(() => this.childRefs.push(React.createRef()));
        }

        if (this.props.sidebar.length) {
            this.props.sidebar.forEach(() => this.sidebarRefs.push(React.createRef()));
        }
    }

    submit() {
        this.props.onSubmit(this.handleSubmit());
    }

    onSubmit(e) {

        e.preventDefault();

        if (! this.state.isSubmitting) {
            this.setState({
                isSubmitting: true
            });
            this.submit();
        }
    }


    ready() {
        this.setState({
            isSubmitting: false
        });
    }

    handleSubmit() {

        let data = {};

        if (! this.props.children.length && ! this.props.sidebar.length) {
            return data;
        }

        this.props.children.forEach((child, i) => {
            this.childRefs[i].current.handleSubmit(data);
        });

        this.props.sidebar.forEach((child, i) => {
            this.sidebarRefs[i].current.handleSubmit(data);
        });

        return data;
    }

    hasMultipleChildren() {
        return this.props.children.length;
    }

    renderChildren() {

        if (! this.props.children.length) {
            return null;
        }

        return this.props.children.map((child, i) => {
            const TagName = child.type;
            return (
                <div key={i} className="form__input">
                    <TagName ref={this.childRefs[i]} {...child.props} errors={this.props.errors} />
                </div>
            );
        });
    }

    renderSidebar() {

        if (! this.props.sidebar.length) {
            return null;
        }

        return this.props.sidebar.map((child, i) => {
            const TagName = child.type;
            return (
                <div key={i} className="form__sidebar-input">
                    <TagName ref={this.sidebarRefs[i]} {...child.props} errors={this.props.errors} />
                </div>
            );
        });
    }

    renderContent() {

        let sidebar;
        let footer;

        if (this.props.sidebar.length) {
            sidebar = (
                <div className="form__sidebar">
                    <div className="form__sidebar-save">
                        <Button
                            text={this.props.submitButtonText}
                            type={(this.props.realForm ? 'submit' : 'button')}
                            onClick={this.props.realForm ? null : this.submit.bind(this)}
                            style={'full'}
                        />
                    </div>
                    {this.renderSidebar()}
                </div>
            );
        } else {
            footer = (
                <div className="form__footer">
                    <Button
                        text={this.props.submitButtonText}
                        type={(this.props.realForm ? 'submit' : 'button')}
                        onClick={this.props.realForm ? null : this.submit.bind(this)}
                    />
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className="form__content">
                    <div className="form__inputs">
                        {this.renderChildren()}
                    </div>
                    {sidebar}
                </div>
                {footer}
            </React.Fragment>
        )
    }

    render() {
        if (this.props.realForm) {
            return (
                <form className={'form'+(this.state.isSubmitting ? ' form--submitting' : '')} onSubmit={e => this.onSubmit(e)}>
                    {this.renderContent()}
                </form>
            );
        }

        return (
            <div className={'form'+(this.state.isSubmitting ? ' form--submitting' : '')}>
                {this.renderContent()}
            </div>
        );
    }
}
