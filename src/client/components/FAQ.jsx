import React from 'react';
import PC from './PC';

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
    question: {
        color: '#503a16',
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 35,
        paddingTop: 10,
        paddingBottom: 10,
        fontWeight: 400
    },
    answer: {
        color: '#2b2b2b',
        fontSize: 16,
        paddingLeft: 10,
        textAlign: 'justify',
        paddingBottom: 15,
        fontWeight: 300,
        lineHeight: '21px',
        // textIndent: 20
    },
    emphasis: {
        fontWeight: 400,
    },
    linkList: {
        textAlign: 'left'
    },
    linkLine: {
    },
    producr: {
        color: appTheme.palette.primary1Color,
        fontWeight: 400
    }
};

// TODO ANCHORS
const FAQ = () => (
    <div style={styles.container}>
        <Paper style={styles.paper}>
            <h1 style={styles.header}>Questions & Answers</h1>

            <div style={styles.answer}>
                This page tries to explain how this application works and why it was created. If you have any other question, feel free to <a href="mailto:producr@ngfar.io">contact us</a>.
            </div>

            <div style={styles.question}>
                What is the purpose of this application ?
            </div>
            <div style={styles.answer}>
                <span style={styles.producr}>producr</span> is a platform that allows people to donate money to the artists they listen on SoundCloud.
                It works like a scrobbler. After having put some money on it, each track you listen will generate a micro-transaction and the artist will receive some money.
                Artists can then connect on the app and get the money back.
                <br/>
                <span style={styles.emphasis}>These transactions are only available for independent music creators.</span>
            </div>

            <div style={styles.question}>
                <span style={{color: '#bf1e00'}}>This application is a Proof-of-Concept !</span>
            </div>

            <div style={styles.answer}>
                This app is currently a prototype. No real money is involved for now. It uses a virtual currency (<PC/>) to prove that the concept works.
                At your first login, we will offer you some coins which will allow you to spend on the platform.
            </div>

            <div style={styles.question}>
                How ?
            </div>
            <div style={styles.answer}>
                You just have to login with your SoundCloud account. Then, your listening history will be tracked and your money will be automatically distributed to the artists you listen.
                <br/>
                You don’t have to use the app to give money, it does it automatically on background. If you want you can stop it any time and get the money back.
                <br/>
                This service can be seen as a donation platform. It doesn’t offer you the ability to play any track. It just allows you to give some money to music creators.
            </div>

            <div style={styles.question}>
                Why ?
            </div>
            <div style={styles.answer}>
                Music industry is still using 100-years old rules. We want to use modern technologies to replace an old and inefficient system. In other words, directly connect consumers and producers. We want to bypass the extra need of opaque third parties that takes a large amount of money, and reward the producers to the fullest.
                <br/>
                We suggest you to read <a href="http://www.theproblem.wtf">theproblem.wtf</a> which explains well the problem.
                <br/>
                Our first step is to connect SoundCloud music creators and listeners. In the future we hope to connect more platforms and extend to other services than music. This utopia is backed by technologies such as blockchain, that permits secure micro-transactions. We suggest you to educate yourself about it on the web as it will be an important revolution during the next years, in the areas of economy, politics, freedom and privacy.
            </div>

            <div style={styles.question}>
                How much money costs a track play ?
            </div>

            <div style={styles.answer}>
                There is a default price at 1€ per play. If you want to give less or more, you can change this in your settings panel.
            </div>


            <div style={styles.question}>
                What happens if my producr wallet goes empty ?
            </div>
            <div style={styles.answer}>
                Don’t worry, if you run out of money on the app, you will still be able to listen music on SoundCloud, you will just not donate to the artists you listen.
            </div>


            <div style={styles.question}>
                Does it cover everything ?
            </div>
            <div style={styles.answer}>
                Once more, this application is just a way to donate to artists. You still have to pay albums and music streaming services if you want.
                <br/>
                Furthermore, transactions are only available for independent creators. For the copyrighted content, see with other content platforms.
            </div>

            <div style={styles.question}>
                I am an artist, how do I get the money that listeners gave me ?
            </div>

            <div style={styles.answer}>
                SoundCloud works the same for listeners and producters. If you are a music creator, juste login to the app like every body, and if any producr user listened to your track, your wallet will be charged with the money that you receive. Just get money back if you want to.
            </div>


            <div style={styles.question}>
                Is there any charge ?
            </div>

            <div style={styles.answer}>
                As the app is currently a prototype and doesn’t use real money, there are no charge for now. The day the app will have a cost, then it will take a small percentage on every transactions. But, the main idea of this concept is to give the most money to the producer and some to the platform, instead of the opposite with common industry standard.
            </div>


            <div style={styles.question}>
                I don’t want anybody to access my listening history.
            </div>
            <div style={styles.answer}>
                Don't be afraid, your history is only used for creating transactions and cannot be viewed by anybody else than you.
            </div>

            <div style={styles.question}>
                Are you affiliated with SoundCloud ?
            </div>
            <div style={styles.answer}>
                We are totally independant, and we do not work with SoundCloud or any music company. We just use the public API that SoundCloud offers to everybody, and open-source software. BTW, you can find the source code of this app there : https://github.com/pakokrew/producr
            </div>

            <div style={styles.question}>
                Read more
            </div>
            <ul style={styles.linkList}>
                <li style={styles.linkLine}>
                    <a href="http://help.soundcloud.com/?b_id=10243">
                        SoundCloud copyright information
                    </a>
                </li>
                <li>
                    <a href="http://uploadandmanage.help.soundcloud.com/customer/en/portal/articles/2162613-choosing-a-license-for-your-track">
                        SoundCloud creative common licensing
                    </a>
                </li>
                <li>
                    <a href="http://www.theproblem.wtf">
                        The problem
                    </a>
                </li>
                <li>
                    <a href="https://fr.kaiko.com/learn">
                        Kaiko's tutorial to Bitcoin
                    </a>
                </li>
                <li>
                    <a href="https://www.ethereum.org/">
                        Ethereum
                    </a>
                </li>
            </ul>
        </Paper>
    </div>
);

export default FAQ;
