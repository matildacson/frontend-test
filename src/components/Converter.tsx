import * as React from 'react';

// As I couldn't get the currency names from the API
// I downloaded this json from https://gist.github.com/Fluidbyte/2973986
import CurrenciesList from '../CommonCurrency.json';
import styled from 'styled-components';
import { CurrencyValue } from './CurrencyValue';

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

const Div = styled.div`
padding: 20px;
`;

const Select = styled.select`
border: none;
border-radius: 5px;
padding: 2px;
margin: 10px 0px;`
;

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
      inputValue: 10, 
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
              inputValue: this.props.amount,
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

    handleCurrencyChange = (e : any) =>{
      console.log(this.state.outputValue, this.state.inputValue, " input output")
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
        const currencyList= Object.values(CurrenciesList).map(currency => 
            <option key={currency.code} value={currency.code}>{currency.name_plural}</option>
        )
        return (
          <Container>
            <Div>
              <Select onFocus={this.handleFocus1} value={this.state.inputCode} onChange={this.handleCurrencyChange} >{currencyList}</Select>
              <CurrencyValue handleFocus={this.handleFocus1} code={this.state.inputCode} value={this.state.inputValue} handleValueChange={this.handleValueChange} handleCurrencyChange={this.handleCurrencyChange}/>
            </Div>
            <Arrow></Arrow>
            <Div>
              <Select onFocus={this.handleFocus2} value={this.state.outputCode} onChange={this.handleCurrencyChange} >{currencyList}</Select>
              <CurrencyValue handleFocus={this.handleFocus2} code={this.state.outputCode} value={this.state.outputValue} handleValueChange={this.handleValueChange} handleCurrencyChange={this.handleCurrencyChange}/>
            </Div>
          </Container>
        
        )
    }
}