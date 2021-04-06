import * as React from 'react';
import styled from 'styled-components';

type CurrencyProps = {
    name: string,
    prefix: string,
    number?: number
}
const CurrencyInput = styled.input`
font-size: 1em;
width: 100px;
    background: white;
    border: none;
    border-radius: 5px;    
`

const Label = styled.label`
margin: 5px;
`;

const Select = styled.select`
width: 100%;
border: none;
border-radius: 5px;
margin: 5px 0px;`
;

export class Currency extends React.Component<CurrencyProps> {
    render(){
        return (
        <div>
            <Select><option>1</option></Select>
            <form role="form" className="form-inline">
                <CurrencyInput className="currency" type="text" defaultValue={this.props.number}/>
                <Label htmlFor="currency">{this.props.prefix}</Label>
            </form></div>
        )
    }
}