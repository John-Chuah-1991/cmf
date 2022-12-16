"use strict";

import React from 'react';
import helpers from "../../util/helpers";
import Title from "./title";
import FilePreview from "./file-preview";
import Button from "./button";
import Select from "./select";
import file from "../../util/file";
import DefinitionList from "./definition-list";
import mimetypes from "../../data/mimetypes";
import MediaMoveWidget from "./media-move-widget";
import Overlay from "./overlay";

export default class FileView extends React.Component {

    static defaultProps = {
        file: {},
        fileLabels: {},
        style: [],
        onDeleteFile: () => {},
        onRenameFile: () => {},
        onLabelFile: (label) => {},
        onMoveFile: () => {},
        onChangeFileProperty: (property, value) => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            moveAction: false
        };
    }

    deleteFile() {
        this.props.onDeleteFile();
    }

    renameFile() {
        this.props.onRenameFile();
    }

    moveFile() {
        this.setState({
            moveAction: true
        });
    }

    downloadFile() {
        window.open(this.props.file.url);
    }

    getFileDescription() {
        if (mimetypes[this.props.file.mime_type] && mimetypes[this.props.file.mime_type].description) {
            return mimetypes[this.props.file.mime_type].description;
        }

        return 'Unknown filetype';
    }

    handleLabelFile(value) {
        this.props.onLabelFile(value);
    }

    handlePropertyChange(property, value) {
        this.props.onChangeFileProperty(property, value);
    }

    renderLabelSelect() {
        if (Object.keys(this.props.fileLabels).length) {

            let options = {};
            Object.keys(this.props.fileLabels).forEach(prop => {
                options[prop] = this.props.fileLabels[prop].name;
            });

            return (
                <div className="file-view__label-select">
                    <Select
                        value={this.props.file.label}
                        nullable={true}
                        nullText={'No label selected'}
                        options={options}
                        onChange={value => this.handleLabelFile(value)}
                        openIcon={'edit'}
                        closeIcon={'edit'}
                    />
                </div>
            );
        }
        return null;
    }

    renderMoveWidget() {

        if (! this.state.moveAction) {
            return null;
        }

        return (
            <Overlay>
                <MediaMoveWidget
                    directory={this.props.file.directory}
                    onCancel={directory => {
                        this.setState({
                            moveAction: false
                        });
                    }}
                    onConfirm={directory => {
                        this.setState({
                            moveAction: false
                        }, () => {
                            this.props.onMoveFile(directory, this.props.file.id);
                        });
                    }}
                />
            </Overlay>
        );
    }

    render() {
        return (
            <div className={helpers.className('file-view', this.props.style)}>
                <div className="file-view__header">
                    <Title style={['small']}>{this.props.file.name}</Title>
                    {this.getFileDescription()}
                    {this.renderLabelSelect()}
                </div>
                <div className="file-view__content">
                    <div className="file-view__preview">
                        <FilePreview
                            style="full"
                            file={this.props.file}
                            mediaConversion={'contain'}
                        />
                    </div>
                    <DefinitionList
                        data={[
                            ['Uploaded', this.props.file.created_at],
                            ['Modified', this.props.file.updated_at],
                            ['Description', this.props.file.description, true],
                            ['Copyright', this.props.file.copyright, true],
                            ['Size', file.filesize(this.props.file.size)],
                            ['Mimetype', this.props.file.mime_type],
                            ['Visibility', this.props.file.visibility, true],
                            ['Disk', this.props.file.disk],
                            ['Conversions disk', this.props.file.conversions_disk],
                        ]}
                        onPropertyChange={(property, value) => this.handlePropertyChange(property, value)}
                    />
                </div>
                <div className="file-view__actions">
                    <Button text={'Rename'} onClick={this.renameFile.bind(this)} style={['secondary', 'full']} />
                    <Button text={'Move'} onClick={this.moveFile.bind(this)} style={['secondary', 'full']} />
                    <Button text={'Download'} onClick={this.downloadFile.bind(this)} style={['secondary', 'full']} />
                </div>
                <div className="file-view__footer">
                    <Button text={'Delete file'} onClick={this.deleteFile.bind(this)} style={['full']} />
                </div>
                {this.renderMoveWidget()}
            </div>
        );
    }
}
