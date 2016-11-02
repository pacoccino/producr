import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

import appTheme from '../theme';

const styles = {
    container: {
        backgroundColor: appTheme.palette.headerBlack,
        color: appTheme.palette.accent2Color,
        fontSize: 15,
        padding: '18px',
        cursor: 'pointer',
        border: '1px solid rgba(0, 0, 0, 0.51)',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        boxSizing: 'border-box'
    },
    link: {
        textDecoration: 'none'
    }
};

class HeaderButton extends Component {
    static propTypes = {
        href: PropTypes.object,
        click: PropTypes.func,
        bgColor: PropTypes.object,
        focus: PropTypes.bool,
    };

    static contextTypes = {
        router: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.toggleHover = this.toggleHover.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event){
        const router = this.context.router;

        if(this.props.href) {
            router.push(this.props.href)
        } else if (this.props.click) {
            this.props.click(event);
        }
    }

    toggleHover(){
        this.setState({hover: !this.state.hover})
    }

    render() {
        var linkStyle = Object.assign({}, styles.container);

        if (this.props.href && this.context.router.isActive({pathname:this.props.href})) {
            linkStyle.backgroundColor = appTheme.palette.shadowColor;
            linkStyle.color = appTheme.palette.alternateTextColor;
        } else {
            linkStyle.backgroundColor = appTheme.palette.headerBlack;
            if (this.state.hover) {
                linkStyle.color = appTheme.palette.alternateTextColor
            } else {
                linkStyle.color = appTheme.palette.accent3Color;
            }
        }

        return (
            <Link
                to={this.props.href}
                onClick={this.props.click}
                style={styles.link}>
                <div
                    style={linkStyle}
                    onMouseEnter={this.toggleHover}
                    onMouseLeave={this.toggleHover}
                >
                    {this.props.children}
                </div>
            </Link>
        );
    }
}

export default HeaderButton;