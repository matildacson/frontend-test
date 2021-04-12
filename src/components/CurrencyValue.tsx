import * as React from 'react';
import styled from 'styled-components';

import {CurrencyProps} from './Currency';

const CurrencyValueInput = styled.input`
font-size: 1em;
width: 100%;
background: white;
padding: 5px;
border: none;
border-radius: 5px;`

const Label = styled.label`
margin: 5px 0px 0px 5px;
`;

const Currency = styled.div`
display: flex;
`;

export const CurrencyValue = ( props: CurrencyProps) => 
    <Currency>
      <CurrencyValueInput className="edit" onFocus={props.handleFocus} value={props.value} type="number" onChange={props.handleValueChange}/>
      <Label htmlFor="edit">{props.code}</Label>
    </Currency>