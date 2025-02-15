import { useState } from 'react'
import Mnemonic from './components/Mnemonic'
import Account from './components/Account'

function App() {

  return (
    <div className="bg-gray-700 min-h-screen">
        <Mnemonic />
        <Account/>
    </div>
  )
}

export default App;
