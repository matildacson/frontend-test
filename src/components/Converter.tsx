import * as React from 'react';

import styled from 'styled-components';

import { Currency } from "./Currency";
import arrow from "../assets/exchange.png"

const Container = styled.div`
font-size: 1em;
display: flex;
flex-wrap: wrap;
justify-content: center;
align-items: center;
font-family: Helvetica neue;
padding: 10px;
@media (max-width: 650px) {
  flex-direction: column;
}
`;

const Arrow = styled.div`
align-items: center;
justify-content: center;
display: flex;
width: 50px;
@media (max-width: 650px) {
  transform: rotate(90deg)
}
`

type StateTypes = {
  error: null,
  isLoaded: boolean,
  rates: [],
  focus: 'input1' | 'input2' | 'none'
  inputValue: number, 
  outputValue: number,
  inputCode: string,
  outputCode: string,
  inputRate: number,
  outputRate: number
}

type ConverterPropTypes = {
  amount: number, 
  initInputCode: string,
  initOutputCode: string,
}

export class Converter extends React.Component<ConverterPropTypes, StateTypes> {
  constructor(props: ConverterPropTypes){
    super(props);
    
    this.state = {
      error: null,
      isLoaded: false,
      rates: [],
      focus: 'none', 
      inputValue: props.amount, 
      outputValue: 0,
      inputCode: props.initInputCode,
      outputCode: props.initOutputCode,
      inputRate: 0,
      outputRate: 0
    }
    
  }

    getRates = () =>{
      fetch(`http://data.fixer.io/api/latest?access_key=0f00e1f43155518de69012a4946a5fa9`)
        .then(response => response.json())
        .then(
          (response) => {
            const inputRate = response.rates[this.props.initInputCode]
            const outputRate = response.rates[this.props.initOutputCode]
            const outputValue = this.props.amount * inputRate / outputRate
            this.setState({
              isLoaded: true,
              rates: response.rates,
              outputValue,
              inputRate,
              outputRate
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )

    }

    getRateFromCurrencyCode = (cC : string) => {
      const rate = this.state.rates[cC]
      return rate
    }

    componentDidMount() {
      this.getRates()
    }

    calculateResult(value: number, rate: number) {
      const outputR = this.state.focus === 'input1' ? this.state.outputRate : this.state.inputRate
      const result = value * rate / outputR
      return result
    }

    handleCurrencyChange = (e : any) => {
      const code = e.target.value;
      const rate = this.getRateFromCurrencyCode(code)

      this.state.focus === 'input1' && (
        this.setState({
          inputCode: code,
          inputRate: rate,
          outputValue: this.calculateResult(this.state.inputValue, rate)
        })
      )
      this.state.focus === 'input2' && (
        this.setState({
          outputCode: code,
          outputRate: rate, 
          inputValue: this.calculateResult(this.state.outputValue, rate)
        })
      )
    }

    // These focus functions is controlling which Currency is input and which is output.
    // If you change the CurrencyValue or Currency of one, the othe  will contain output. 
    handleFocus1 = () => {
      this.setState({
        focus: 'input1'
      })
    }

    handleFocus2 = () => {
      this.setState({
        focus: 'input2'
      })
    }

    handleValueChange = (e: any) => {
      const value = e.target.value
      this.state.focus === 'input1' ? (
      this.setState({
        inputValue: value,
        outputValue: this.calculateResult(value, this.state.inputRate)
      })) : this.setState({
          outputValue: value,
          inputValue: this.calculateResult(value, this.state.outputRate)
        }) 
    }

    render(){
        return (
          <Container>
            <Currency 
              value={this.state.inputValue} 
              code={this.state.inputCode}
              handleFocus={this.handleFocus1} 
              handleCurrencyChange={this.handleCurrencyChange} 
              handleValueChange={this.handleValueChange}
              />
            <Arrow><img src={arrow} alt="" height="30px"/></Arrow>
            <Currency 
              value={this.state.outputValue} 
              code={this.state.outputCode}
              handleFocus={this.handleFocus2} 
              handleCurrencyChange={this.handleCurrencyChange} 
              handleValueChange={this.handleValueChange}
              />
          </Container>
        
        )
    }
}