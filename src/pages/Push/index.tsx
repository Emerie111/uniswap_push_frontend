import * as EpnsAPI from '@epnsproject/sdk-restapi'
import { TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, ElementName, EventName } from '@uniswap/analytics-events'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { ButtonPrimary } from 'components/Button'
import { useToggleWalletModal } from 'state/application/hooks'
import styled, { useTheme as Theme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import Logo from '../../assets/images/icons8-bell-64.png'
import channelinfo from '../../constants/channelinfo'
import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Pushchannel from 'components/pushnotification/pushchannel'
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb'

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

function WrongCard() {
  const theme = Theme()

  return (
    <ErrorContainer>
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={EventName.CONNECT_WALLET_BUTTON_CLICKED}
        properties={{ received_swap_quote: false }}
        element={ElementName.CONNECT_WALLET_BUTTON}
      >
        <ThemedText.DeprecatedBody color={theme.deprecated_text3} textAlign="center">
          <img src={Logo} alt="React Logo" />
          <div>
            <Trans>You currently have no notifications, try subscribing to some channels.</Trans>
          </div>
        </ThemedText.DeprecatedBody>
      </TraceEvent>
    </ErrorContainer>
  )
}
function WrongNetwork() {
  const theme = Theme()

  return (
    <ErrorContainer>
      <ThemedText.DeprecatedBody color={theme.deprecated_text3} textAlign="center">
        <img src={Logo} alt="React Logo" />
        <div>
          <Trans>please switch network to receive notifications.</Trans>
        </div>
      </ThemedText.DeprecatedBody>
    </ErrorContainer>
  )
}

export default function Push() {
  const yourChannel = channelinfo.map((info) => info.channel)
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const { account, chainId, provider } = useWeb3React()

  const [notifications, setNotification] = useState([])
  const [channelOptStatus, setChannelOptStatus] = useState<string[]>([])
  const [usercount, setCount] = useState(1)
  // fetching the user notification

  useEffect(() => {
    const fetchData = async () => {
      const data = await EpnsAPI.user.getFeeds({
        user: `eip155:${chainId}:${account}`, // user address in CAIP or in address if defaulting to Ethereum
        env: 'staging',
      })
      setNotification(data)
      setCount(usercount + 1)
    }
    if (account) {
      console.log('Calling user details')
      fetchData().catch(console.error)
    }
  }, [account])

  // fetching user channel subscriptions
  useEffect(() => {
    const fetchData = async () => {
      const data = await EpnsAPI.user.getSubscriptions({
        user: account, // user address in CAIP or in address if defaulting to Ethereum
        env: 'staging',
      })

      let channels: string[] = []
      channels = []
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        console.log(element.channel)
        if (yourChannel.includes(element.channel)) {
          // setChannelOptStatus([])
          if (!channels.includes(element.channel)) {
            channels.push(element.channel)
          }
        }
      }
      setChannelOptStatus(channels)
    }

    if (account) {
      console.log('Calling user details')
      fetchData().catch(console.error)
    }
  }, [account])
  //

  const toggleWalletModal = useToggleWalletModal()

  const theme1 = Theme()
  const showConnectAWallet = Boolean(!account) //checking wallet connected
  return (
    <div>
      {showConnectAWallet && (
        <ErrorContainer>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={EventName.CONNECT_WALLET_BUTTON_CLICKED}
            properties={{ received_swap_quote: false }}
            element={ElementName.CONNECT_WALLET_BUTTON}
          >
            <ThemedText.DeprecatedBody color={theme1.deprecated_text3} textAlign="center">
              <img src={Logo} alt="React Logo" />
              <div>
                <Trans>Connect your wallet to see notifications.</Trans>
              </div>
            </ThemedText.DeprecatedBody>

            <ButtonPrimary style={{ marginTop: '2em', padding: '8px 16px' }} onClick={toggleWalletModal}>
              <Trans>Connect a wallet</Trans>
            </ButtonPrimary>
          </TraceEvent>
        </ErrorContainer>
      )}
      {!showConnectAWallet && (
        <Box sx={{ bgcolor: 'background.paper', width: 1500 }}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Inbox" {...a11yProps(0)} />
              <Tab label="Uniswap Channels" {...a11yProps(1)} />
            </Tabs>
          </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            {notifications.length > 0 ? (
              <div>
                {notifications.map((oneNotification, i) => {
                  const { cta, title, message, app, icon, image, url, blockchain, secret, notification } =
                    oneNotification
                  return (
                    <NotificationItem
                      key={`notif-${i}`}
                      notificationTitle={secret ? notification['title'] : title}
                      notificationBody={secret ? notification['body'] : message}
                      cta={cta}
                      app={app}
                      icon={icon}
                      image={image}
                      url={url}
                      theme={'light'}
                      chainName={blockchain as chainNameType}
                    />
                  )
                })}
              </div>
            ) : (
              <WrongCard />
            )}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {channelinfo.map((info) => (
              <div key={info.id}>
                <Pushchannel
                  account={account}
                  provider={provider}
                  channel={info.channel}
                  channelname={info.name}
                  icon={info.icon}
                  channelstatus={channelOptStatus}
                  setChannelOptStatus={setChannelOptStatus}
                  setCount={setCount}
                  info1={info.info}
                  chainid={chainId!}
                />
              </div>
            ))}
          </TabPanel>
        </Box>
      )}
    </div>
  )
}
