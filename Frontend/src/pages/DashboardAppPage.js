import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid, Container, Typography, Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Snackbar,
  IconButton,
  TableContainer,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Scrollbar from '../components/scrollbar';

import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';


const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'sno', label: 'S. No.', alignRight: false },
  { id: 'Name', label: 'Name', alignRight: false },
  { id: 'File Type', label: 'File Type', alignRight: false },
  { id: 'Size', label: 'Size', alignRight: false },
  { id: 'Action', label: 'Action', alignRight: false },
  { id: '', label: '', alignRight: false },

];


const TABLE_HEAD_USER = [
  { id: '', label: '', alignRight: false },
  { id: 'sno', label: 'S. No.', alignRight: false },
  { id: 'Email', label: 'Name', alignRight: false },
  { id: '', label: '', alignRight: false },

];
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const navigate = useNavigate()
  const theme = useTheme();
  const [user, setUser] = useState({})
  const [totalFiles, setTotalFiles] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const [files, setFiles] = useState([])
  const [analyticsReady, setAnalyticsReady] = useState(false)
  const [uniqueEmails, setUniqueEmails] = useState([])
  const [publicAccessFiles, setPublicAccessFiles] = useState([])
  const [externalFilesCount, setExternalFilesCount] = useState(0)


  const checkAuth = async () => {
    const gId = localStorage.getItem('gId')

    if (!gId) {
      navigate('/login')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {

    getUser()
    getUserFiles()
    getAnalytics()
  }, [])

  const getUser = async () => {
    let res;
    const gId = localStorage.getItem('gId')

    res = await fetch(`http://localhost:3000/getUserData?gId=${gId}`)

    res = await res.json();

    console.log("USWR DARA", res.data)
    setUser(res.data)
  }

  const getUserFiles = async () => {
    let res;
    const gId = localStorage.getItem('gId')

    res = await fetch(`http://localhost:3000/fetchFiles?gId=${gId}`)

    res = await res.json();


    console.log("FILES", res.data);

    setTotalFiles(res.data.length)
    let size = 0
    size = res.data.reduce((acc, elem) => {
      if (elem.size) {
        acc += parseInt(elem.size, 10)
      }
      return acc
    }, 0)


    setTotalSize(size)
    setFiles(res.data.slice(0, 5))

  }

  const getAnalytics = async () => {
    let res;
    const gId = localStorage.getItem('gId')

    res = await fetch(`http://localhost:3000/fetchAnalytic?gId=${gId}`)

    res = await res.json();

    setUniqueEmails(res.data.uniqueEmails)
    setPublicAccessFiles(res.data.publicAccessFiles)
    setExternalFilesCount(res.data.externalFilesCount)
    setAnalyticsReady(true)
  }

  const deleteFileFromDrive = async(id) =>{

    let res;
    const gId = localStorage.getItem('gId')

    res = await fetch(`http://localhost:3000/deleteFile?gId=${gId}&fileId=${id}`)

    res = await res.json();

    console.log("DELETION RESPOSNE ==> ", res)
    let arr = [...files]

    arr = arr.filter((elem) => elem.id !== id)

    setFiles(arr)

    arr = [...publicAccessFiles]

    arr = arr.filter((elem) => elem.id !== id)

    setPublicAccessFiles(arr)
  }
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2 }}>
          {user !== null ?
            <span style={{ display: 'flex', justifyContent: '' }}>

              <img src={user.profilePicture} alt='' style={{ marginRight: '50px', borderRadius: '50%', height: '40px' }} />
              <span> Hi, {user.name}</span>

            </span> : <></>}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Total Files" total={totalFiles} icon={'icon-park-outline:order'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Total Space Used" total={totalSize} color="info" icon={'fluent-mdl2:completed'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Free Space" total={15360 * 1024 * 1024 - totalSize} color="success" icon={'fluent-mdl2:completed'} />
          </Grid>




          <Container style={{ marginTop: '50px', width: '100%', paddingRight: '0' }} >


            <Card >
              <UserListToolbar title={'Recently Added Files'} />

              {files.length !== 0 ?


                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={files.length}
                      // onRequestSort={handleRequestSort}
                      />
                      <TableBody >
                        {files.map((row, index) => {
                          const { name, size, mimeType, id, webViewLink } = row;

                          return (
                            <TableRow hover key={index} tabIndex={-1} role="checkbox" >

                              <TableCell align='left'>
                                { }
                              </TableCell>
                              <TableCell align='left'>
                                {index + 1}
                              </TableCell>

                              <TableCell align='left'>
                                {name}
                              </TableCell>

                              <TableCell align="left">{mimeType}</TableCell>

                              <TableCell align="left">{parseInt(size / (1024 * 1024), 10) === 0 ?
                                parseInt(size / (1024), 10) === 0 ? `${size} Bytes` : `${parseInt(size / (1024), 10)} Kb`
                                : `${parseInt(size / (1024 * 1024), 10)} Mb`
                              }</TableCell>

                              <TableCell align="right" style={{ display: 'flex' }}>

                                <LoadingButton fullWidth size="large" type="submit" style={{ marginTop: '20px', marginRight: '10px', backgroundColor: 'rgba(250,0,0,0.7)' }} variant="contained" onClick={() => { deleteFileFromDrive(id) }}>
                                  Delete
                                </LoadingButton>
                                 <a href={webViewLink} target='_blank' rel="noreferrer" style={{ marginRight: '10px' }}>
                                    <LoadingButton fullWidth size="large" type="submit" style={{ marginTop: '20px', marginRight: '10px', }} variant="contained" onClick={() => { }}>
                                      Open
                                    </LoadingButton>
                                  </a>

                              </TableCell>

                              <TableCell align="right">
                                <IconButton size="large" color="inherit" >
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>


                            </TableRow>
                          );
                        })}

                      </TableBody>


                    </Table>
                  </TableContainer>
                </Scrollbar>


                : null}
            </Card>

            {!analyticsReady ? <Card style={{ marginTop: '50px' }}><Typography margin={3}>Please wait, analytics of the drive are being calculated...</Typography></Card> : null}
            {analyticsReady ? <>
              <Card style={{ marginTop: '50px' }}>
                <Typography margin={3}>Google Drive  -  Analytics</Typography>
              </Card>
              <Grid marginTop={4} container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <AppWidgetSummary title="Public Access Files" total={publicAccessFiles.length} color="error" icon={'fluent-mdl2:completed'} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <AppWidgetSummary title="Users with Access" total={uniqueEmails.length} color="info" icon={'fluent-mdl2:completed'} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <AppWidgetSummary title="External Files" total={externalFilesCount} icon={'fluent-mdl2:completed'} />
                </Grid>
              </Grid>
              {
                uniqueEmails.length !== 0 ?

                  <Card style={{ marginTop: '50px' }}>
                    <UserListToolbar title={'Users with access to files in drive'} />

                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                          <UserListHead
                            headLabel={TABLE_HEAD_USER}
                            rowCount={uniqueEmails.length}
                          // onRequestSort={handleRequestSort}
                          />
                          <TableBody >
                            {uniqueEmails.map((email, index) => {
                              // const { name, size, mimeType } = row;

                              return (
                                <TableRow hover key={index} tabIndex={-1} role="checkbox" >

                                  <TableCell align='left'>
                                    { }
                                  </TableCell>
                                  <TableCell align='left'>
                                    {index + 1}
                                  </TableCell>

                                  <TableCell align='left'>
                                    {email}
                                  </TableCell>


                                </TableRow>
                              );
                            })}

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Card >

                  : null
              }

              {publicAccessFiles.length !== 0 ?
                <Card style={{ marginTop: '50px' }}>
                  <UserListToolbar title={'Publicly Accessible File'} />

                  <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                      <Table>
                        <UserListHead
                          headLabel={TABLE_HEAD}
                          rowCount={publicAccessFiles.length}
                        // onRequestSort={handleRequestSort}
                        />
                        <TableBody >
                          {publicAccessFiles.map((row, index) => {
                            const { name, size, mimeType, id, webViewLink } = row;

                            return (
                              <TableRow hover key={index} tabIndex={-1} role="checkbox" >

                                <TableCell align='left'>
                                  { }
                                </TableCell>
                                <TableCell align='left'>
                                  {index + 1}
                                </TableCell>

                                <TableCell align='left'>
                                  {name}
                                </TableCell>

                                <TableCell align='left'>
                                  {mimeType}
                                </TableCell>


                                <TableCell align="left">{parseInt(size / (1024 * 1024), 10) === 0 ?
                                  parseInt(size / (1024), 10) === 0 ? `${size} Bytes` : `${parseInt(size / (1024), 10)} Kb`
                                  : `${parseInt(size / (1024 * 1024), 10)} Mb`
                                }</TableCell>

                                <TableCell align="right" style={{ display: 'flex' }}>

                                  <LoadingButton fullWidth size="large" type="submit" style={{ marginTop: '20px', marginRight: '10px', backgroundColor: 'rgba(250,0,0,0.7)' }} variant="contained" onClick={() => { deleteFileFromDrive(id)}}>
                                    Delete
                                  </LoadingButton>
                                   <a href={webViewLink} target='_blank' rel="noreferrer" style={{ marginRight: '10px' }}>
                                    <LoadingButton fullWidth size="large" type="submit" style={{ marginTop: '20px', marginRight: '10px', }} variant="contained" onClick={() => { }}>
                                      Open
                                    </LoadingButton>
                                  </a>

                                </TableCell>
                              </TableRow>
                            );
                          })}

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Card >


                : null}

            </>



              : null}
          </Container>
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Invoices"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Udaipur',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Delhi',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Bangalore',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Invoices"
              chartData={[
                { label: 'Delhi', value: 34 },
                { label: 'Mumbai', value: 23 },
                { label: 'Bangalore', value: 6 },
                { label: 'Jaipur', value: 32 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

        </Grid>
      </Container>
    </>
  );
}
