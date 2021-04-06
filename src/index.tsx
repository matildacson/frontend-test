import * as React from 'react';
import { render } from 'react-dom';
import { Currency } from './Currency';
import styled from 'styled-components';


const Div = styled.div`
    font-size: 1em;
    background: lightlightgrey;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    font-family: Helvetica neue;
    margin: 10px;
`;

const Wrapper = styled.div`
    background: turquoise;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: auto;
    margin: -10px;
`;

const App: React.FC = () => 
    <div>
        <Wrapper>
            <Div>
                <Currency name="Svenska kronor" prefix="SEK"/>
            </Div>
            <Div>
                <Currency name="Svenska kronor" prefix="SEK"/>
            </Div>
        </Wrapper>
    </div>;

render(<App />, document.getElementById('app'));
