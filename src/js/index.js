import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'

import Stopwatch from './stopWatch.js'

import './../css/index.css'

class App extends React.Component {

   constructor(props){
      super(props)
      this.state = {
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
         numberOfWinner: 0,
      }

      this.accountSet = new Set()

      if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         this.web3 = new Web3(web3.currentProvider)
      } else {
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      }

      const MyContract = web3.eth.contract([
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "totalBet",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [
      			{
      				"name": "",
      				"type": "address"
      			}
      		],
      		"name": "playerInfo",
      		"outputs": [
      			{
      				"name": "amountBet",
      				"type": "uint256"
      			},
      			{
      				"name": "numberSelected",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "owner",
      		"outputs": [
      			{
      				"name": "",
      				"type": "address"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "numberOfBets",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "minimumBet",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "maxAmountOfBets",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [
      			{
      				"name": "player",
      				"type": "address"
      			}
      		],
      		"name": "checkPlayerExists",
      		"outputs": [
      			{
      				"name": "",
      				"type": "bool"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"name": "players",
      		"outputs": [
      			{
      				"name": "",
      				"type": "address"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "deadline",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "deadlineMin",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [],
      		"name": "generateNumberWinner",
      		"outputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"anonymous": false,
      		"inputs": [
      			{
      				"indexed": false,
      				"name": "numberWin",
      				"type": "uint256"
      			}
      		],
      		"name": "NumberGenerated",
      		"type": "event"
      	},
      	{
      		"constant": false,
      		"inputs": [
      			{
      				"name": "numberSelected",
      				"type": "uint256"
      			}
      		],
      		"name": "bet",
      		"outputs": [],
      		"payable": true,
      		"stateMutability": "payable",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [
      			{
      				"name": "_deadlineMin",
      				"type": "uint256"
      			},
      			{
      				"name": "_minimumBet",
      				"type": "uint256"
      			}
      		],
      		"name": "changeRules",
      		"outputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [],
      		"name": "kill",
      		"outputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"payable": true,
      		"stateMutability": "payable",
      		"type": "fallback"
      	},
      	{
      		"inputs": [
      			{
      				"name": "_minimumBet",
      				"type": "uint256"
      			},
      			{
      				"name": "_deadlineMin",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "constructor"
      	}
      ])

          this.state.ContractInstance = MyContract.at("0xb4c418e3c51e01b5d36fdfe24ea098401181dff2")

      }

      componentDidMount(){

            this.updateState()
            this.setupListeners()
            this.getNumberOfWinner()

            setInterval(this.updateState.bind(this), 10e3)

            this._stopWatch.socket.on("BetOn", data => {

              this.accountSet = new Set(data.account)

              let numberOfBets = this.state.numberOfBets

              this._stopWatch.socket.emit("BetResponse", numberOfBets )

            })

            this._stopWatch.socket.on("ExecuteOn", data => {

              this.accountSet.clear()

              if ( this.state.numberOfBets === 0 && this.state.numberOfWinner !== 0 ){
                this._stopWatch.socket.emit("ExecuteResponse")
              }
            })

      }

      getNumberOfWinner(){

        var event = this.state.ContractInstance.NumberGenerated().watch( (error, result) => {
          if(error)
            console.log(error);
          else
            var number = result.args.numberWin.toString(10)
            this.setState({
                 numberOfWinner: parseInt(number)
            })
        } )
      }

      updateState(){

            this.state.ContractInstance.minimumBet((err, result) => {
               if(result != null){
                  this.setState({
                     minimumBet: parseFloat(web3.fromWei(result, 'ether'))
                  })
               }
            })
            this.state.ContractInstance.totalBet((err, result) => {
               if(result != null){
                  this.setState({
                     totalBet: parseFloat(web3.fromWei(result, 'ether'))
                  })
               }
            })
            this.state.ContractInstance.numberOfBets((err, result) => {
               if(result != null){
                  this.setState({
                     numberOfBets: parseInt(result)
                  })
               }
            })
            this.state.ContractInstance.maxAmountOfBets((err, result) => {
               if(result != null){
                  this.setState({
                     maxAmountOfBets: parseInt(result)
                  })
               }
            })
         }

    // Listen for events and executes the voteNumber method
       setupListeners(){
          let liNodes = this.refs.numbers.querySelectorAll('li')
          let execute = this.execute

          function removeHoverAll(){
            // Remove the other number selected
               for(let i = 0; i < liNodes.length; i++){
                  liNodes[i].className = ''
               }
          }

          liNodes.forEach(number => {

             number.addEventListener('click', event => {

               if ( !this._stopWatch.state.isExecuteOn && !this._stopWatch.state.isTimerEnd && !this.accountSet.has(web3.eth.accounts[0]) ){

                 event.target.className = 'number-selected'
                 this.voteNumber(parseInt(event.target.innerHTML), done => {
                   removeHoverAll()
                 })

               } else if ( this._stopWatch.state.isExecuteOn ) {
                 alert("Not allowed during that it is calculating.")
               } else if ( this._stopWatch.state.isTimerEnd ) {
                 alert("Not allowed when time is up.")
               } else if ( this.accountSet.has(web3.eth.accounts[0]) ) {
                 alert("Not allowed multi votes at one time.")
               }

            })

          })

          execute.addEventListener('click', event => {

            if ( !this._stopWatch.state.isBetOn && !this._stopWatch.state.isTimerOn
                  && this._stopWatch.state.isBetCompleted && !this._stopWatch.state.isExecuteOn){

              this.executeNum()

            } else if ( this._stopWatch.state.isTimerOn ) {

              alert("Not allowed until time is up.")

            } else if ( this._stopWatch.state.isBetOn ) {

              alert("Betting is progressing.")

            } else if (this._stopWatch.state.isExecuteOn) {

              alert("Not allowed during that it is calculating.")

            } else if ( !this._stopWatch.state.isBetCompleted ) {

              alert("Betting is not completed.")

            }

          })

       }

    executeNum(){
      let txid

      this.state.ContractInstance.generateNumberWinner({
        from: web3.eth.accounts[0],
        gas: 350000
      }, (err, result) => {

        if(err){
          console.log(err)
          return
        }

        console.log(result);

        this.result.innerHTML = 'Transaction id:' + result + '<span id="pending" style="color:red;">(Pending)</span>'
        txid = result

        this._stopWatch.socket.emit("ExecuteStart", txid)

        var filter = web3.eth.filter('latest')

        filter.watch((e, r) => {
            web3.eth.getTransaction(txid, (e,r) => {
            if (r != null && r.blockNumber > 0) {

              web3.eth.getTransactionReceipt(txid, (e,r) => {

                if(parseInt(r.status.toString(10)) === 1){
                  document.getElementById('pending').innerHTML = '(기록된 블록: ' + r.blockNumber + ')';
                  document.getElementById('pending').style.cssText ='color:green;';

                } else {
                  document.getElementById('pending').innerHTML = '(오류가 발생했습니다. 다시 실행해주세요.)';
                  document.getElementById('pending').style.cssText ='color:red;';

                }

                filter.stopWatching()
              })
            }
         })
       })

      })
    }

    voteNumber(number, cb){
          let bet = this.refs['ether-bet'].value

          if(!bet) bet = 0.1

          var txid;

          if(parseFloat(bet) < this.state.minimumBet){

             alert('You must bet more than the minimum')

             cb()

          } else {

              this.state.ContractInstance.bet(number, {
                 gas: 300000,
                 from: web3.eth.accounts[0],
                 value: web3.toWei(bet, 'ether')
              }, (err, result) => {

                if(err){
                  console.log(err)
                  cb()
                  return
                }
                 let data = {
                   account: web3.eth.accounts[0],
                   countDown: 300
                 }

                 this._stopWatch.socket.emit("BetStart", data)

                 this.result.innerHTML = 'Transaction id:' + result + '<span id="pending" style="color:red;">(Pending)</span>'

                 txid = result

                 var filter = web3.eth.filter('latest')

                 filter.watch((e, r) => {

                   web3.eth.getTransaction(txid, (e,r) => {
                     if (r != null && r.blockNumber > 0) {

                       web3.eth.getTransactionReceipt(txid, (e,r) => {
                         if(parseInt(r.status.toString(10)) === 1){
                           document.getElementById('pending').innerHTML = '(기록된 블록: ' + r.blockNumber + ')';
                           document.getElementById('pending').style.cssText ='color:green;';
                           console.log(parseInt(r.status.toString(10)))

                         } else {
                           document.getElementById('pending').innerHTML = '(중복베팅 불가 - 한 계정 당 한번씩 실행할 수 있습니다.)';
                           document.getElementById('pending').style.cssText ='color:red;';
                           console.log(parseInt(r.status.toString(10)))

                         }
                         filter.stopWatching()
                       })
                     }
                  })
                })

                 this.setState({
                   numberOfWinner: 0
                 })
                 cb()
               })
            }
        }

    render(){

          return (
             <div className="main-container">
                <h1>Bet for your best number and win huge amounts of Ether</h1>

                <div className="block">
                   <b>Number of bets:</b> &nbsp;
                   <span>{this.state.numberOfBets}</span>
                </div>

                <div className="block">
                   <b>Last number winner:</b> &nbsp;
                   <span>{this.state.lastWinner}</span>
                </div>

                <div className="block">
                   <b>Total ether bet:</b> &nbsp;
                   <span>{this.state.totalBet} ether</span>
                </div>

                <div className="block">
                   <b>Minimum bet:</b> &nbsp;
                   <span>{this.state.minimumBet} ether</span>
                </div>

                <div className="block">
                   <b>Max amount of bets:</b> &nbsp;
                   <span>{this.state.maxAmountOfBets} ether</span>
                </div>

                <div className="block">
                   <b>The Number of Winner:</b> &nbsp;
                   <span>{this.state.numberOfWinner}</span>
                </div>

                <div id="result" ref = {(result) => { this.result = result }}>

                </div>
                <div id="execute" ref = {(execute) => { this.execute = execute }}>
                  Click to execute
                </div>
                <Stopwatch ref={(stopWatch) => { this._stopWatch = stopWatch }} />
    <hr/>

                <h2>Vote for the next number</h2>

                <label>
                   <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
                   <br/>
                </label>

                <ul ref="numbers">
                   <li>1</li>
                   <li>2</li>
                   <li>3</li>
                   <li>4</li>
                   <li>5</li>
                   <li>6</li>
                   <li>7</li>
                   <li>8</li>
                   <li>9</li>
                   <li>10</li>
                </ul>
             </div>
          )
       }
    }

    ReactDOM.render(
       <App />,
       document.querySelector('#root')
    )
