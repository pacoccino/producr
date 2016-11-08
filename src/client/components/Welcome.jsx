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
        width: '100%',
        padding: 20,
        textAlign: 'center',
    },
    header: {
        color: appTheme.palette.accent3Color
    },
    producr: {
        color: appTheme.palette.primary1Color,
        fontWeight: 400
    }
};

const Welcome = () => (
    <div style={styles.container}>
        <Paper style={styles.paper}>
            <h1 style={styles.header}>Welcome !</h1>
            <p>
                <span style={styles.producr}>producr</span> is an application aimed to revolutionize exchanges between producers and consumers.
            </p>
            <p>
                It simply connects to your SoundCloud account and record your listening history.
                <br/>
                On the app you have a wallet that you can charge, and each track that you play will generate a micro-transaction from you to the producer, in order to donate some money to him.
            </p>
            <p>
                First step is to connect with your SoundCloud account. On first login, we will offer you some money to redistribute to the artists you love.
            </p>
            <p>
                We suggest you to read the <Link href="/qa">Q&A</Link> to understand how the app works and why it was created.
            </p>
            <Link to="/login">
                <RaisedButton
                    fullWidth={true}
                    label="Give it a try !"
                    primary={true}
                />
            </Link>

        </Paper>
    </div>
);

export default Welcome;
