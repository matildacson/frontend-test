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
// names with "1" in them are connected to the left side Currency
// names with "2" in them are connected to the right side Currency
type StateTypes = {
  error: null,
  isLoaded: boolean,
  rates: [],
  focus: 'input1' | 'input2' | 'none'
  value1: number, 
  value2: number,
  code1: string,
  code2: string,
  rate1: number,
  rate2: number
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
      value1: props.amount, 
      value2: props.amount,
      code1: props.initInputCode,
      code2: props.initOutputCode,
      rate1: 0,
      rate2: 0
    }
    
  }

    getRates = () =>{
      fetch(`http://data.fixer.io/api/latest?access_key=0f00e1f43155518de69012a4946a5fa9`)
        .then(response => response.json())
        .then(
          (response) => {
            const rate1 = response.rates[this.props.initInputCode]
            const rate2 = response.rates[this.props.initOutputCode]
            const value2 = this.props.amount * rate1 / rate2
            this.setState({
              isLoaded: true,
              rates: response.rates,
              value2,
              rate1,
              rate2
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

    // returns the rate corresponding to the right key
    getRateFromCurrencyCode = (cC : string) => {
      const rate = this.state.rates[cC]
      return rate
    }

    // fetching the api data which is added to state
    componentDidMount() {
      this.getRates()
    }

    //calculates output values depending on which input field is in focus
    calculateResult(value: number, rate: number) {
      const outputR = this.state.focus === 'input1' ? this.state.rate2 : this.state.rate1
      const result = value * rate / outputR
      return result
    }

    handleCurrencyChange = (e : any) => {
      const code = e.target.value;
      const rate = this.getRateFromCurrencyCode(code)

      this.state.focus === 'input1' && (
        this.setState({
          code1: code,
          rate1: rate,
          value2: this.calculateResult(this.state.value1, rate)
        })
      )
      this.state.focus === 'input2' && (
        this.setState({
          code2: code,
          rate2: rate, 
          value1: this.calculateResult(this.state.value2, rate)
        })
      )
    }

    // The focus functions are controlling which Currency is input and which is output.
    // If you change the CurrencyValue or Currency of one, the other will contain output. 

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
      this.state.focus === 'input1' && 
      this.setState({
        value1: value,
        value2: this.calculateResult(value, this.state.rate1)
      })
      this.state.focus === 'input2' &&  
      this.setState({
          value2: value,
          value1: this.calculateResult(value, this.state.rate2)
        }) 
    }

    render(){
        return (
          <Container>
            <Currency 
              value={this.state.value1} 
              code={this.state.code1}
              handleFocus={this.handleFocus1} 
              handleCurrencyChange={this.handleCurrencyChange} 
              handleValueChange={this.handleValueChange}
              />
            <Arrow><img src={arrow} alt="" height="30px"/></Arrow>
            <Currency 
              value={this.state.value2} 
              code={this.state.code2}
              handleFocus={this.handleFocus2} 
              handleCurrencyChange={this.handleCurrencyChange} 
              handleValueChange={this.handleValueChange}
              />
          </Container>
        
        )
    }
}