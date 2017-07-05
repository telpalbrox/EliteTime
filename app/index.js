import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import App from './app';

ReactDOM.render(
  <LocaleProvider locale={esES}>
    <App />
  </LocaleProvider>
  , document.querySelector('#elite-time'));
