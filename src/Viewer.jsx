/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

import React from 'react';
import './Viewer.css';

class Viewer extends React.Component {
    constructor(props) {
        super(props);

        this.viewerRef = React.createRef();
        this.viewerDomRef = React.createRef();
        this.viewer = null;
    }

    componentWillUnmount() {
        if (!this.viewerRef.current) return;

        this.viewerRef.current.finish();
    }

    componentDidMount() {
        const props = this.props;
        let viewerOptions = props.viewerOptions;

        const options = Object.assign({}, viewerOptions, {
            env: props.env,
            api: props.api || 'derivativeV2', // for models uploaded to EMEA change this option to 'derivativeV2_EU'
        });

        if (this.props.accessToken) {
            options.accessToken = props.accessToken;
        } else {
            options.getAccessToken = props.getAccessToken;
        }

        Autodesk.Viewing.Initializer(options, async () => {
            const viewer = new Autodesk.Viewing.GuiViewer3D(this.viewerDomRef.current);
            this.viewerRef.current = viewer;

            const startedCode = viewer.start();
            if (startedCode > 0) {
                console.error("Failed to create a Viewer: WebGL not supported.");
                return;
            }

            this.loadModel(viewer, props.urn);
        });
    }

    loadModel(viewer, documentId) {
        if (!documentId)
            return;

        function onDocumentLoadSuccess(viewerDocument) {
            const bubbleNode = viewerDocument.getRoot();
            const defaultModel = bubbleNode.getDefaultGeometry(true);

            viewer.loadDocumentNode(viewerDocument, defaultModel);
        }

        function onDocumentLoadFailure() {
            console.error("Failed fetching Forge manifest");
        }

        if(!documentId.startsWith('urn:'))
            documentId = `urn:${documentId}`;

        Autodesk.Viewing.Document.load(
            documentId,
            onDocumentLoadSuccess,
            onDocumentLoadFailure
        );
    }

    render() {
        return (
            <div id="forgeViewer" ref={this.viewerDomRef}></div>
        );
    }
}
export default Viewer;