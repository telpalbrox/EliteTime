import React from 'react';
const appVersion = require('electron').remote.app.getVersion();

export default function Footer() {
    return (<footer className="row">Version {appVersion}</footer>);
};
