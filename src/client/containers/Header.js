import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { logout }  from '../actions';

class Header extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    logout
};

export default connect(null, mapDispatchToProps)(Header);