import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
    container: {
        position: 'absolute',
        left: '50%',
        top: '50%',
    }
};

const FullLoader = () => (
    <div style={styles.container}>
        <RefreshIndicator
            size={100}
            status={"loading"}
            left={-50}
            top={-50}
        />
    </div>
);

export default FullLoader;
