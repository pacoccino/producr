import React from 'react';
import Header from '../containers/Header';

const PageInt = ( {children }) => (
    <div>
        <Header />
        <div style={{
            width: '764px',
            margin: 'auto',
            padding: '0px 30px',
        }}>
            {children}
        </div>
    </div>
);

export default PageInt;
