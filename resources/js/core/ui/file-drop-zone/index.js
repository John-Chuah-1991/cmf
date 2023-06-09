import './index.scss';

import React from 'react';
import util from "../util";
import api from "../../../api/api";
import upload from "../../../util/upload";
import Icon from "../icon";

class FileDropZone extends React.Component {

    static defaultProps = {
        directory: null,
        onUploadStart: (file, directoryId) => {},
        onCreateFile: (file) => {},
        onCreateDirectory: (directory) => {},
        onUploadDone: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isDragOver: false
        };

        this.dragOverCounter = 0;

        this.dragEnterHandler = this.handleDragEnter.bind(this);
        this.dragOverHandler = this.handleDragOver.bind(this);
        this.dragLeaveHandler = this.handleDragLeave.bind(this);
        this.dropHandler = this.handleDrop.bind(this);
    }

    componentDidMount() {
        document.addEventListener('dragover', this.dragOverHandler);
        document.addEventListener('dragenter', this.dragEnterHandler);
        document.addEventListener('dragleave', this.dragLeaveHandler);
        document.addEventListener('drop', this.dropHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('dragenter', this.dragEnterHandler);
        document.removeEventListener('dragover', this.dragOverHandler);
        document.removeEventListener('dragleave', this.dragLeaveHandler);
        document.removeEventListener('drop', this.dropHandler);
    }

    handleDragEnter(e) {

        this.dragOverCounter++;

        this.setState({
            isDragOver: true
        });

        e.preventDefault();
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragLeave(e) {

        this.dragOverCounter--;

        if (this.dragOverCounter === 0) {

            this.setState({
                isDragOver: false
            });

            e.preventDefault();
        }
    }

    handleDrop(e) {

        this.dragOverCounter = 0;

        e.preventDefault();

        let currentDirectoryId = this.props.directory;

        this.setState({
            isDragOver: false
        });

        if( e.dataTransfer ) {

            let items = e.dataTransfer.items;
            let files = e.dataTransfer.files;

            if (items) { // This goes false when reading items instead of files is unsupported
                for (let i = 0 ; i < items.length ; i += 1) {
                    let item = items[i].webkitGetAsEntry();
                    if (item) {
                        this.uploadFileTree(item, currentDirectoryId);
                    }
                }
            } else if (files.length) {
                this.uploadMultiple(files, currentDirectoryId);
            }
        }
    }

    uploadFileTree(item, directoryId = null) {

        if (item.isFile) {

            item.file(file => {
                if (file.name !== '.DS_Store') {
                    this.upload(file, directoryId);
                }
            });

        } else if (item.isDirectory) {

            api.media.createDirectory(item.name, directoryId).then(response => {

                let directory = response.data.data;
                this.props.onCreateDirectory(directory);

                // Get folder contents
                let dirReader = item.createReader();

                // Loop through contents and add these to the just created directory
                dirReader.readEntries(entries => {
                    for (let i = 0; i < entries.length; i++) {
                        this.uploadFileTree(entries[i], directory.id);
                    }
                });
            });
        }
    }

    upload(file, directoryId) {

        this.props.onUploadStart(file, directoryId);

        upload.queue(file, directoryId, file => {
            this.props.onCreateFile(file);
            if (upload.isDone()) {
                this.props.onUploadDone();
            }
        });
    }

    uploadMultiple(files, directoryId) {
        upload.queueMultiple(files, directoryId, file => {
            this.props.onCreateFile(file);
            if (upload.isDone()) {
                this.props.onUploadDone();
            }
        });
    }

    uploadProgress(e, file, directoryId) {
        let percent = (e.loaded / e.total) * 100;
    }

    render() {
        return (
            <div className={'file-drop-zone'+(this.state.isDragOver ? ' file-drop-zone--drag-over' : '')}>
                <div className="file-drop-zone__overlay">
                    <Icon name={'upload_file'} style={['extra-large', 'alt']} />
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default FileDropZone;
