import React from 'react';
import { Link } from 'react-router';

import { Paper, RaisedButton } from 'material-ui';
import appTheme from '../theme';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center'
    },
    paper: {
        width: 400,
        margin: 20,
        padding: 20,
        textAlign: 'center',
    },
    header: {
        color: appTheme.palette.accent3Color
    }
};

const NoMatch = () => (
    <div style={styles.container}>
        <Paper style={styles.paper}>
            <h1 style={styles.header}>Oops !</h1>
            <p>We can't find what you're looking for...</p>
            <Link to="/">
                <RaisedButton
                    fullWidth={true}
                    label="Go back home"
                    primary={true}
                />
            </Link>

        </Paper>
    </div>
);

export default NoMatch;
