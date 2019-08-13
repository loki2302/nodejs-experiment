import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TodoAppComponent } from './TodoAppComponent';
import { configure } from 'mobx';
import { Store } from './Store';
import Axios from 'axios';

configure({
    enforceActions: 'always'
});

const axios = Axios.create({
    baseURL: '/api/'
});
const store = new Store(axios);

ReactDOM.render(
    <TodoAppComponent store={store} />,
    document.getElementById('app')
);
