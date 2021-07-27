import React, { Component } from 'react'
import { Link } from "react-router-dom";

import CharGrid from '../freqword/CharGrid'
import CharDisplay from '../freqword/CharDisplay'
import simpCharacters from '../../../data/simpCharacters.json'
import tradCharacters from '../../../data/tradCharacters.json'

const knowWords = new Array(40).fill(false)
const secondKnowWords = new Array(30).fill(false)
const blackStyle = {margin: "10px", background: "#333333", color: "#FFFFFF", boxShadow: "1px 1px #333333"}
const whiteStyle = {margin: "10px", background: "#FFFFFF", color: "#333333", boxShadow: "1px 1px #333333"}

let first = []
let second = []

for (let i = 0; i < 5000; i+=250) {
    let idx = Math.floor(Math.random()*250 + i)
    let sidx = Math.floor(Math.random()*250 + i)
    while (idx === sidx) {
        sidx = Math.floor(Math.random()*250 + i)
    }
    let temp = [idx, sidx]
    temp.sort((a,b) => a-b)
    first.push(temp[0])
    first.push(temp[1])
} 

class Test extends Component {
    constructor (props) {
        super(props)
        this.state = {
            score: 0,
            currentKnowledge: knowWords,
            secondKnowledge: secondKnowWords, 
            screen: 1,
            currentHanzi: "X",
            currentPinyin: "XXX",
            currentDefinition: "XXX",
            currentBaiduLink: "https://baike.baidu.com/item/的",
            currentLineDictLink: "https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query=的",
            isSimplified: true,
            CharacterData: simpCharacters
        }
    }

    firstList = () => {
        if (this.state.screen !== 1)
            return null
        let stuff = []
        for (let i = 0; i < 40; i++) {
            let charDetail = this.state.CharacterData[first[i]]
            stuff.push(
                <div key={i}>
                    <div id={first[i]} onClick={() => this.handleCharChange(first[i])}>
                        <CharGrid id={first[i]+1}
                                hanzi={charDetail.hanzi}
                                onClick={this.state.currentKnowledge[i] === false ? () => this.handleIncrementCount(i) : () => this.handleDecrementCount(i)}
                                style={this.state.currentKnowledge[i] === true ? blackStyle : whiteStyle}
                                />
                    </div>
                </div>
            )
        }
        return stuff 
    }

    secondList = () => {
        if (this.state.screen !== 2)
            return null

        let stuff = []
        for (let i = 0; i < second.length; i++) {
            let charDetail = this.state.CharacterData[second[i]]
            stuff.push(
                <div key={i}>
                    <div id={second[i]} onClick={() => this.handleCharChange(second[i])}>
                        <CharGrid id={second[i]+1}
                                    hanzi={charDetail.hanzi}
                                    onClick={this.state.secondKnowledge[i] === false ? () => this.handleIncrementCount(i) : () => this.handleDecrementCount(i)}
                                    style={this.state.secondKnowledge[i] === true ? blackStyle : whiteStyle}
                                    />
                    </div>
                </div>
            )
        }
        return stuff
    }

    handleCharChange = (index) => {
        this.setState({
            currentHanzi: this.state.CharacterData[index]["hanzi"],
            currentPinyin: this.state.CharacterData[index]["pinyin"],
            currentDefinition: this.state.CharacterData[index]["definition"],
            currentBaiduLink: "https://baike.baidu.com/item/"+this.state.CharacterData[index]["hanzi"],
            currentLineDictLink: "https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query="+this.state.CharacterData[index]["hanzi"]
        })
    }

    handleIncrementCount = (index) => {
        let newKnow = this.state.currentKnowledge
        let secondNewKnow = this.state.secondKnowledge
        let newScore = this.state.score
        
        if (this.state.screen === 1) {
            newScore += 5000
            newKnow[index] = true
        }
        else if (this.state.screen === 2) {
            secondNewKnow[index] = true
        }

        this.setState({ score: newScore, currentKnowledge: newKnow, secondKnowledge: secondNewKnow })
    }

    handleDecrementCount = (index) => {
        let newKnow = this.state.currentKnowledge
        let secondNewKnow = this.state.secondKnowledge
        let newScore = this.state.score
        
        if (this.state.screen === 1) {
            newScore -= 5000
            newKnow[index] = false
        }
        else if (this.state.screen === 2) {
            secondNewKnow[index] = false
        }

        this.setState({ score: newScore, currentKnowledge: newKnow, secondKnowledge: secondNewKnow })
    }

    switchType = () => {
        this.setState({ isSimplified: !this.state.isSimplified, CharacterData: (this.state.isSimplified ? tradCharacters : simpCharacters )})
        this.props.history.push("/test");
    }

    handleContinue = () => {
        let newScore = this.state.score / 40
        this.setState({ screen: 2, score: newScore })

        let second_low = []
        if (newScore > 150) {
            while (second_low.length < 15) {
                let idx = Math.floor(Math.random()*150 + newScore-150)
                if (second_low.indexOf(idx) === -1)
                    second_low.push(idx) 
            }
        }

        let second_high = []
        if (newScore < 4850) {
            while (second_high.length < 15) {
                let idx = Math.floor(Math.random()*(150) + newScore)
                if (second_high.indexOf(idx) === -1)
                    second_high.push(idx) 
            }
        }
        second = [...second_low, ...second_high]
        second.sort((a,b) => a-b)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let currentScore = this.state.score
        let arr = this.state.secondKnowledge
        if (second.length === 30) {
            for (let i = 0; i < 15; i++) {
                if (!arr[i])
                    currentScore-=10
            }
            for (let i = 15; i < 30; i++) {
                if (arr[i])
                    currentScore+=10
            }
        } else {
            if (currentScore <= 150) {
                for (let i = 0; i < 15; i++) {
                    if (arr[i])
                        currentScore+=10
                }
            } else if (currentScore >= 4850) {
                for (let i = 0; i < 15; i++) {
                    if (!arr[i])
                        currentScore-=10
                }
            }
        }

        if (currentScore < 0) 
            currentScore = 0
        else if (currentScore >= 5000)
            currentScore = "5000+"
        this.setState({ screen: 3, score: currentScore})
    }

    
    refreshPage = () => {
        window.location.reload()
    }

    resetPage = () => {
        first = []
        for (let i = 0; i < 5000; i+=250) {
            let idx = Math.floor(Math.random()*250 + i)
            let sidx = Math.floor(Math.random()*250 + i)
            while (idx === sidx) {
                sidx = Math.floor(Math.random()*250 + i)
            }
            let temp = [idx, sidx]
            temp.sort((a,b) => a-b)
            first.push(temp[0])
            first.push(temp[1])
        } 

        for (let i = 0; i < 40; i++) knowWords[i] = false
        for (let i = 0; i < 30; i++) secondKnowWords[i] = false
        this.setState({ currentKnowledge: knowWords, secondKnowledge: secondKnowWords })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <form className={this.state.screen !== 3 ? "col-8" : "col-12"} onSubmit={this.handleSubmit}>
                        <h1 style={{marginTop: "10px", color: "#017dfa"}} className="text-center">Quick Test</h1>
                            <Link to="/">
                                <button className="btn btn-link" onClick={this.resetPage}><i className="fa fa-arrow-left"></i> Back to home</button>
                            </Link>
                            <button style={{marginLeft: "20px"}} type="button" className="btn btn-primary btn-sm" onClick={this.switchType}>Switch to {this.state.isSimplified ? "Traditional" : "Simplified"}</button>
                            
                        <h3>How many Chinese characters do you know?</h3>
                        <p>Take this 3-minute test to get an estimate of how many Chinese Characters you can recognize!</p>
                        <h3>What counts as knowing a character?</h3>
                        <p>You can consider yourself as knowing a character when you can use it in a sentence. Knowing the Pinyin doesn't count because many characters can be guessed.</p>
                        <h3>How does it work?</h3>
                        <p>Click all the characters you know. Clicking a word also reveals its definition on the right, which can be used to check if you know the word or not. Click "continue" to proceed.</p>
                        <div>{this.firstList()}</div>
                        {this.state.screen === 1 && <button style={{marginBottom: "30px"}} className="btn btn-primary btn-block" type="button" onClick={this.handleContinue}>Continue</button>}
                        <div>{this.secondList()}</div>
                        {this.state.screen === 2 && <button style={{marginBottom: "20px"}} className="btn btn-primary btn-block" type="submit" onClick={this.handleSubmit}>Submit</button>}
                        {this.state.screen === 3 && 
                        <div>
                            <h4>The number of characters you recognize is approximately <span style={{color: "#379df1"}}>{this.state.score}</span></h4>
                            <button style={{marginTop: "10px", marginBottom: "20px"}} className="btn btn-success" onClick={this.refreshPage}>Retake Test</button>
                        </div>
                        }
                    </form>

                    {this.state.screen !== 3 && 
                    <div className="col-4" style={{padding: "13px", position: "fixed", top: 0, bottom: 0, right: 0, overflowY: "scroll", background: "#333333"}}>
                        <CharDisplay hanzi={this.state.currentHanzi}
                                     pinyin={this.state.currentPinyin}
                                     definition={this.state.currentDefinition}
                                     baiduLink={this.state.currentBaiduLink}
                                     linedictLink={this.state.currentLineDictLink}/>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default Test