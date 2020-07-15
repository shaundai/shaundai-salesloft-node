import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';
import getSalesLoftApi from './util/returnName'
import salesloftlogo from '../images/salesloftlogo.png'
import linkedin from '../images/linkedin.png'
import salesforce from '../images/salesforce.png'
import website from '../images/websiteicon.png'

function App() {

  const [myName, setMyName] = useState('');

  useEffect(() => {
    const getMyName = async () => {
      const name = (await getSalesLoftApi()).id;
      setMyName(name);
      console.log(name)
      }
      getMyName();
}, []);

  return (
    <div style={{fontFamily: 'Montserrat', color: '#4F5359'}}>
        <Header>
          <img alt="SalesLoft Logo" src={salesloftlogo} style={{height: '2em', marginLeft: '1em'}}/>
        </Header>
        <div style={{paddingTop: '.3em'}}>
        <Welcome>
        Welcome, <b>User {myName}</b>!
        </Welcome>
        
        <Welcome>How will you hit your quota this quarter?</Welcome>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
        <TierBlock>
          <TierTitle>Tier 1</TierTitle>
          <ListAccount>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div><b>Account</b></div>
              <div style={{fontSize: '.7em'}}># Employees</div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1em'}}>
              <div style={{fontSize: '.7em'}}>Account Owner </div>
              <div style={{fontSize: '.7em'}}>Last Contacted: </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <img alt="Salesforce" src={salesforce} style={{margin: '0 .4em', height: '1.2em'}} />
              <img alt="LinkedIn" src={linkedin} style={{margin: '0 .4em', height: '1.2em'}} />
              <img alt="Company Website"  src={website} style={{margin: '0 .4em', height: '1.2em'}}/>
              </div>
          </ListAccount>
        </TierBlock>
        <TierBlock>
          <TierTitle>Tier 2</TierTitle>
        </TierBlock>
        <TierBlock>
          <TierTitle>Tier 3</TierTitle>
        </TierBlock>
        </div>
    </div>
  );
}

export default App;

const Header = styled.div`
  color: white;
  background-color: #0d163a;
  padding: .7em 0;
`

const Welcome = styled.div`
  padding-left: 1.5em;
  padding-top: .7em;
`

const TierBlock = styled.div`
  border: 1px solid #e5e5e5;
  width: calc(75%/3);
  margin: 0 2em;
  height: 60vh;
  border-right: 2px solid rgba(0,0,0,.1);
`
const TierTitle = styled.div`
  border-bottom: 2px solid rgba(0,0,0,.1);
  background: linear-gradient(rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.03)),#fff;
  text-align: center;
  font-weight: bold;
  padding: .5em 0;
`
const ListAccount = styled.div`
  border-bottom: 1px solid rgba(0,0,0,.1);
  padding: .5em;
`