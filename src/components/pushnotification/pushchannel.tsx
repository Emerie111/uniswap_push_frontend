import * as React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Unstable_Grid2'
import styled from 'styled-components/macro'
import * as EpnsAPI from '@epnsproject/sdk-restapi'
interface IToolbarProps {
  account?: string
  provider: any
  channelstatus: string[]
  channel: string
  setChannelOptStatus: any
  setCount: any
  channelname: string
  icon: string
  info1: string
  chainid: number
}

export default function Pushchannel(props: IToolbarProps) {
  const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  })
  return (
    <Box
      sx={{
        display: 'grid',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
        p: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
      }}
    >
      <Grid container spacing={10} minHeight={160}>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <Typography sx={{ fontWeight: '700', align: 'center', color: '#d500f9', fontSize: '30px' }}>
            {props.channelname}
          </Typography>
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <Avatar alt="Remy Sharp" variant="circular" src={props.icon} sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <Typography
            sx={{
              color: '#d500f9',
              align: 'center',
              variant: 'subtitle2',
              fontSize: 'small',
            }}
            gutterBottom
          >
            {props.info1}
          </Typography>
        </Grid>
      </Grid>

      <BootstrapButton
        variant="contained"
        disableRipple
        onClick={async () => {
          if (props.channelstatus.includes(props.channel)) {
            // user subscribed, unsubscribe them
            await EpnsAPI.channels.unsubscribe({
              signer: props.provider?.getSigner(props.account),
              channelAddress: `eip155:5:${props.channel}`, // channel address in CAIP
              userAddress: `eip155:${props.chainid}:${props.account}`, // user address in CAIP
              onSuccess: () => {
                let index = props.channelstatus.findIndex((channel) => channel === props.channel)
                props.channelstatus[index] = ''
                index = 0
                props.setChannelOptStatus(props.channelstatus)
                console.log(props.channelstatus)
                props.setCount(2)
              },
              onError: () => {
                console.error('opt out error')
              },
              env: 'staging',
            })
          } else {
            // user unsubscribed, subscribe them
            await EpnsAPI.channels.subscribe({
              signer: props.provider?.getSigner(props.account),
              channelAddress: `eip155:5:${props.channel}`, // channel address in CAIP
              userAddress: `eip155:${props.chainid}:${props.account}`, // user address in CAIP
              onSuccess: () => {
                let data = []
                data = props.channelstatus
                console.log('opt in success')
                data.push(props.channel)
                console.log('data:', data)
                props.setChannelOptStatus(data)
                props.setCount(3)
              },
              onError: () => {
                console.error('opt in error')
              },
              env: 'staging',
            })
          }
        }}
      >
        {props.channelstatus.includes(props.channel) ? 'Gasless opt-out' : 'Gasless opt-in'}
      </BootstrapButton>
    </Box>
  )
}
