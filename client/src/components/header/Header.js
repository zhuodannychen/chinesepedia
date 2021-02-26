import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'


function Header () {
    const auth = useSelector(state => state.auth)

    const {user, isLogged} = auth

    const handleLogout = async () => {
        try {
            await axios.get('/user/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="link avatar">
            <img style={{margin: "5px"}} src={user.avatar} alt=""/> {user.name} <i className="fa fa-angle-down"></i>
            </Link>
            <ul className="dropdown">
                <li><Link className="link" to="/profile">Profile</Link></li>
                <li><Link className="link" to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
        </li>
    }

    const transForm = {
        transform: isLogged ? "transformY(-5px)" : 0
    }

    return (
        <header>
            <div className="logo">
                <h2><Link className="link" to="/">Chinesepedia</Link></h2>
            </div>

            <ul style={transForm}>
                <li><Link className="link" to="/words">Word List</Link></li>
                {
                    isLogged
                    ? userLink()
                    :<li><Link className="link" to="/login"><i className="fa fa-user"></i> Sign in</Link></li>
                }
                
            </ul>
        </header>
    )
}

export default Header