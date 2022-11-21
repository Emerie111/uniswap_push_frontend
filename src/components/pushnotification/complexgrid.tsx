import * as React from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import Avatar from '@mui/material/Avatar'
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
})
interface IToolbarProps {
  notificationTitle: string
  icon: string
  notificationBody: string
}

export default function ComplexGrid(props: IToolbarProps) {
  return (
    <Paper
      sx={{
        p: '10px',
        margin: 'auto',
        maxWidth: 1000,
        flexGrow: 1,
        variant: 'outlined',
        gap: 2,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Avatar alt="Remy Sharp" variant="circular" src={props.icon} sx={{ width: 100, height: 100 }} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {props.notificationTitle}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {props.notificationBody}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
