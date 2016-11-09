import React, {Component, PropTypes} from 'react';

import appTheme from '../theme';

const styles = {
    container: {
        backgroundColor: appTheme.palette.headerBlack,
        color: appTheme.palette.accent2Color,
        fontSize: 15,
        padding: '18px',
        cursor: 'pointer',
        borderLeft: '1px solid rgba(0, 0, 0, 0.51)',
        borderRight: '1px solid rgba(0, 0, 0, 0.51)',
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
        href: PropTypes.string,
        click: PropTypes.func,
        style: PropTypes.object,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            selected: false
        };
        this.toggleHover = this.toggleHover.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount() {
        this.context.router.listen(() =>{
            this.setState({selected: (this.props.href && this.context.router.isActive({pathname:this.props.href}))})
        })
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
        var linkStyle = Object.assign({}, styles.container, this.props.style);

        if(this.state.selected) {
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

        if(this.props.style && this.props.style.backgroundColor)
            linkStyle.backgroundColor = this.props.style.backgroundColor;
        if(this.props.style && this.props.style.color)
            linkStyle.color = this.props.style.color;

        return (
                <div
                    style={linkStyle}
                    onMouseEnter={this.toggleHover}
                    onMouseLeave={this.toggleHover}
                    onClick={this.onClick}
                >
                    {this.props.children}
                </div>
        );
    }
}

export default HeaderButton;