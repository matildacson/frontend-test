
import * as React from 'react';
import styled from 'styled-components';

// As I couldn't get the currency names from the API (needs pro plan)
// I downloaded this json from https://gist.github.com/Fluidbyte/2973986
import CurrenciesList from '../assets/CommonCurrency.json';
import { CurrencyValue } from './CurrencyValue';

//style
const Div = styled.div`
  padding: 20px;
`;

const Select = styled.select`
  border: none;
  border-radius: 5px;
  padding: 2px;
  margin: 10px 0px;
  `;


export type CurrencyProps = {
    handleValueChange: (e: any) => void,
    handleCurrencyChange: (e: any) => void,
    handleFocus: () => void,
    code: string,
    value: number
  }

export const Currency = ( props: CurrencyProps) => {
    const currenciesList= Object.values(CurrenciesList).map(currency => 
        <option key={currency.code} value={currency.code}>{currency.name_plural}</option>
    )
    return(
        <Div>
            <Select 
                value={props.code} 
                onFocus={props.handleFocus} 
                onChange={props.handleCurrencyChange}
            >
                {currenciesList}
            </Select>
            <CurrencyValue 
                code={props.code} 
                value={props.value} 
                handleFocus={props.handleFocus} 
                handleValueChange={props.handleValueChange} 
                handleCurrencyChange={props.handleCurrencyChange}
            />
         </Div>
    )
}
