import React, {useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser} from './redux/actions/authAction'

import Header from './components/header/Header'
import Body from './components/body/Body'
import Freqword from './components/body/freqword/Freqword'
import Test from './components/body/test/Test'
import About from './components/body/about/About'
import axios from 'axios'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null)
        dispatch({type: 'GET_TOKEN', payload: res.data.accessToken})
      }
      getToken()
    }
  },[auth.isLogged, dispatch])

  useEffect(() => {
    if(token){
      const getUser = () => {
        dispatch(dispatchLogin())

        return fetchUser(token).then(res => {
            dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token, dispatch])

  return (
    <Router>
        <div className="App">
            <Switch>
                <Route path="/freqword" component={Freqword} exact />
                <Route path="/test" component={Test} exact />
                <Route path="/about" component={About} exact />
                <Route path="/" component={Header} />
            </Switch>
            <Body />
        </div>
    </Router>
  );
}

export default App;
