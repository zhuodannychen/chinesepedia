import React, { Component, useState, useEffect } from "react";
import axios from 'axios'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Link, useHistory } from "react-router-dom";
// import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import simpCharacters from '../../../data/simpCharacters.json'
import tradCharacters from '../../../data/tradCharacters.json'
import CharGrid from './CharGrid'
import CharDisplay from './CharDisplay'


const knowWords = new Array(5000).fill(false)
const blackStyle = {margin: "10px", background: "#333333", color: "#FFFFFF", boxShadow: "1px 1px #333333"}
const whiteStyle = {margin: "10px", background: "#FFFFFF", color: "#333333", boxShadow: "1px 1px #333333"}

const initialState = {
    currentHanzi: "的",
    currentPinyin: "de/dí/dì",
    currentDefinition: "(possessive particle)/of, really and truly, aim/clear",
    currentBaiduLink: "https://baike.baidu.com/item/的",
    currentLineDictLink: "https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query=的",
    currentKnowledge: knowWords,
    count: 0,
    tabIndex: 0,
    loading: true,
    isSimplified: true,
    FreqCharacters: simpCharacters,
    searchBar: ""
}

function Freqword () {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const {user, isLogged} = auth
    const [info, setInfo] = useState(initialState)
    const history = useHistory()

    useEffect(() => {
        if (user.length !== 0) {
            axios.get('/user/infor_id/' + user._id)
            .then((response) => {
                const data = response.data
                console.log(data)
                info.count = data.frequencyCount

                info.currentKnowledge = data.frequencyList
                info.tabIndex = data.tabIndex
                info.loading = false
                info.isSimplified = data.isSimplified

                if (info.isSimplified)
                    info.FreqCharacters = simpCharacters
                else
                    info.FreqCharacters = tradCharacters

                history.push('/freqword')
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [user])

    const showItems = (start, end) => {
        let stuff = []
        for (let index = start; index < end; index++) {
            let charDetail = info.FreqCharacters[index]
            stuff.push(
                <div key={index}>
                    <div id={index} onClick={() => handleCharChange(index)}>
                        <CharGrid id={index+1}
                                hanzi={charDetail.hanzi}
                                onClick={info.currentKnowledge[index] === false ? () => handleIncrementCount(index) : () => handleDecrementCount(index)}
                                style={info.currentKnowledge[index] === true ? blackStyle : whiteStyle}
                                />
                    </div>
                </div>
            )
        }
        return stuff
    }

    const handleCharChange = (index) => {
        setInfo({
            ...info,
            currentHanzi: info.FreqCharacters[index]["hanzi"],
            currentPinyin: info.FreqCharacters[index]["pinyin"],
            currentDefinition: info.FreqCharacters[index]["definition"],
            currentBaiduLink: "https://baike.baidu.com/item/"+info.FreqCharacters[index]["hanzi"],
            currentLineDictLink: "https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query="+info.FreqCharacters[index]["hanzi"]
        })
    }

    const handleIncrementCount = (index) => {
        info.currentKnowledge[index] = true
        ++info.count
        
        if (isLogged) {
            try {
                axios.patch('/user/update', {
                    name: user.name,
                    avatar: user.avatar,
                    frequencyCount: info.count,
                    frequencyList: info.currentKnowledge,
                    tabIndex: info.tabIndex,
                    isSimplified: info.isSimplified
                },{
                    headers: {Authorization: token}
                })
            } catch (err) {
                console.log(err.response.data.msg)
            }
        }
        history.push('/freqword')
    }

    const handleDecrementCount = (index) => {
        info.currentKnowledge[index] = false
        --info.count

        if (isLogged) {
            axios.patch('/user/update', {
                name: user.name,
                avatar: user.avatar,
                frequencyCount: info.count,
                frequencyList: info.currentKnowledge,
                tabIndex: info.tabIndex,
                isSimplified: info.isSimplified
            },{
                headers: {Authorization: token}
            })
        }
        history.push('/freqword')
    }

    const switchType = () => {
        info.isSimplified = !info.isSimplified

        if (info.isSimplified)
            info.FreqCharacters = simpCharacters
        else
            info.FreqCharacters = tradCharacters
        
        if (isLogged) {
            try {
                axios.patch('/user/update', {
                    name: user.name,
                    avatar: user.avatar,
                    frequencyCount: info.count,
                    frequencyList: info.currentKnowledge,
                    tabIndex: info.tabIndex,
                    isSimplified: info.isSimplified
                },{
                    headers: {Authorization: token}
                })
            } catch (err) {
                console.log(err.response.data.msg)
            }
        }

        history.push('/freqword')
    }

    const handleSearchChange = (event) => {
        info.searchBar = event.target.value
    }

    if (isLogged && info.loading) {
        return (<h1 style={{marginTop: "100px"}}>Loading...</h1>)
    }

    return (
        <div className="container-fluid" style={{marginTop: "5px"}}>
            <Link className="backArrow" to="/">
                <i className="fa fa-arrow-left" style={{margin: "10px"}}></i> Back to home
            </Link>

            <button style={{marginLeft: "20px"}} type="button" className="charType btn btn-primary btn-sm" onClick={switchType}>Switch to {info.isSimplified ? "Traditional" : "Simplified"}</button>

            <div className="row text-center" style={{marginTop: "10px"}}>
                <Tabs className="col-8" selectedIndex={info.tabIndex} onSelect={tabIndex => setInfo({ ...info, tabIndex })}>
                {!isLogged ? <p style={{background: "#ffcccb", padding: "5px", borderRadius: "5px"}}>Warning! In order to save your progress, you must <Link to="/login">sign in</Link> or <Link to="/register">create an account</Link>.</p> : <></>}
                <TabList>
                    <Tab>1</Tab>
                    <Tab>2</Tab>
                    <Tab>3</Tab>
                    <Tab>4</Tab>
                    <Tab>5</Tab>
                    <Tab>6</Tab>
                    <Tab>7</Tab>
                    <Tab>8</Tab>
                    <Tab>9</Tab>
                    <Tab>10</Tab>
                    <Tab>11</Tab>
                    <Tab>12</Tab>
                    <Tab>13</Tab>
                    <Tab>14</Tab>
                    <Tab>15</Tab>
                    <Tab>16</Tab>
                    <Tab>17</Tab>
                    <Tab>18</Tab>
                    <Tab>19</Tab>
                    <Tab>20</Tab>
                </TabList>

                <TabPanel>{showItems(0, 250)}</TabPanel>
                <TabPanel>{showItems(250, 500)}</TabPanel>
                <TabPanel>{showItems(500, 750)}</TabPanel>
                <TabPanel>{showItems(750, 1000)}</TabPanel>
                <TabPanel>{showItems(1000, 1250)}</TabPanel>
                <TabPanel>{showItems(1250, 1500)}</TabPanel>
                <TabPanel>{showItems(1500, 1750)}</TabPanel>
                <TabPanel>{showItems(1750, 2000)}</TabPanel>
                <TabPanel>{showItems(2000, 2250)}</TabPanel>
                <TabPanel>{showItems(2250, 2500)}</TabPanel>
                <TabPanel>{showItems(2500, 2750)}</TabPanel>
                <TabPanel>{showItems(2750, 3000)}</TabPanel>
                <TabPanel>{showItems(3000, 3250)}</TabPanel>
                <TabPanel>{showItems(3250, 3500)}</TabPanel>
                <TabPanel>{showItems(3500, 3750)}</TabPanel>
                <TabPanel>{showItems(3750, 4000)}</TabPanel>
                <TabPanel>{showItems(4000, 4250)}</TabPanel>
                <TabPanel>{showItems(4250, 4500)}</TabPanel>
                <TabPanel>{showItems(4500, 4750)}</TabPanel>
                <TabPanel>{showItems(4750, 5000)}</TabPanel>
            </Tabs>

                <div className="col-4" style={{padding: "13px", position: "fixed", top: 0, bottom: 0, right: 0, overflowY: "auto", background: "#282c34", zIndex: '1'}}>
                    <h5 className="knowledge-count" style={{marginTop: "135px", color: "#FFFFFF"}}>You know {info.count} of 5000 characters</h5>
                    <CharDisplay hanzi={info.currentHanzi}
                                    pinyin={info.currentPinyin}
                                    definition={info.currentDefinition}
                                    baiduLink={info.currentBaiduLink}
                                    linedictLink={info.currentLineDictLink}/>
                    <form style={{margin: 0}}>
                        <label>
                            <input style={{height: "37px", margin: "5px"}} className="input-group-text" type="text" name="searchBar" placeholder="Search" value={info.searchBar} onChange={e => setInfo({...info, searchBar: e.target.value})}/>
                        </label>
                        
                        <a className="btn btn-primary" href={"https://google.com/search?q=" + info.searchBar} target="_blank" rel="noopener noreferrer">Submit</a>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Freqword