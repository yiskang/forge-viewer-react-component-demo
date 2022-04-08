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
import Viewer from './Viewer';

class App extends React.Component {
    render() {
        const getToken = async (callback) => {
            const resp = await fetch('/api/forge/oauth/token');
            if (resp.ok) {
                const token = await resp.json();
                callback(token.access_token, token.expires_in);
            } else {
                throw new Error(await resp.text());
            }
        };

        return (
            <Viewer
                urn="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXlidWNrZXQvcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA"
                //accessToken="eyJhbGciOiJIU..."
                getAccessToken={getToken}
            />
        );
    }
}
export default App;