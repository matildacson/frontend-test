import * as React from 'react';
import { render } from 'react-dom';
import { Converter } from './components/Converter';
import styled from 'styled-components';

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
        <Wrapper>
                <Converter amount={1} initInputCode={'SEK'} initOutputCode={'EUR'}/>
        </Wrapper>;
render(<App />, document.getElementById('app'));
