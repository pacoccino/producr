import React from 'react';

import PCImage from '../../public/images/pc.png';

const ProdCoin = (props) => {
    const size = 13;
    const style = {
        width: size,
        height: size,
        display: 'inline',
        verticalAlign: 'middle'
    };
    Object.assign(style, props.style);

    return (
        <img style={style} src={PCImage}/>
    );
};

export default ProdCoin;
