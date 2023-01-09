import '../styles/globals.css'
import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/layout/main'
import theme from '../lib/theme'

function MyApp({ Component, pageProps, router }) {
  const [accounts, setAccounts] = useState([])
  const [chainId, setChainId] = useState("0x5")

  if (typeof window !== "undefined") {
    window.ethereum.on('accountsChanged', (x) => setAccounts(0))
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout router={router} accounts={accounts} setAccounts={setAccounts} chainId={chainId} setChainId={setChainId}>
        <Component {...pageProps} accounts={accounts} chainId={chainId} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
