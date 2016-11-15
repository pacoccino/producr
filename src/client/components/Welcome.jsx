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
    },
    emphasis: {
        fontWeight: 400
    }
};

const Welcome = () => (
    <div style={styles.container}>
        <Paper style={styles.paper}>
            <h1 style={styles.header}>Welcome !</h1>
            <p>
                <span style={styles.producr}>producr</span> is an application aimed to revolutionize exchanges between <span style={styles.emphasis}>independent</span> producers and consumers.
            </p>
            <p>
                It simply connects to your SoundCloud account and records your listening history.
                <br/>
                On the app you will be able to charge a wallet on your account, and each track that you play will generate a micro-transaction from you to the producer, in order to make a donation.
            </p>
            <p>
                First step is to connect to your SoundCloud account. On your first login, we will offer you some credits to redistribute to the artists you love.
            </p>
            <p>
                We suggest reading the <Link href="/qa">Q&A</Link> for a better understanding of how the app works and why it was created.
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
