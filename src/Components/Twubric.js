import { Box, Grid, Typography, ButtonGroup, Button, TextField, Popover } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classes from "./Twubric.module.css";

function Twubric() {

    const [twubricData, setTwubricData] = useState([]);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const getTwubricData = () => {
        axios.get("https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/82e3ef99cde5b6e313922a5ccce7f38e17f790ac/twubric.json")
            .then((res) => setTwubricData(res.data))
            .catch((err) => console.log(err))
    }

    const deleteTwubricData = (uid) => {
        const updatedData = twubricData.filter((item) => (
            item.uid !== uid
        ))

        setTwubricData(updatedData)
    }

    const sortByKey = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    }

    const resetData = () => {
        getTwubricData();
        setSortKey(null);
        setSortOrder('asc');
        setStartDate('');
        setEndDate('');
    }

    useEffect(() => {
        getTwubricData();
    }, [])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const sortedTwubricData = twubricData.sort((a, b) => {
        if (sortKey) {
            const comparison = a.twubric[sortKey] - b.twubric[sortKey];
            return sortOrder === 'asc' ? comparison : -comparison;
        }
        return 0;
    });

    const filteredTwubricData = sortedTwubricData.filter((personData) => {
        if (startDate && endDate) {
            const joinDate = new Date(personData.join_date * 1000);
            return joinDate >= new Date(startDate) && joinDate <= new Date(endDate);
        }
        return true;
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'date-popover' : undefined;

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
            <Grid item xs={12}>
                <Box>
                    <ButtonGroup style={{ flexWrap: 'wrap' }}>
                        <Button onClick={() => sortByKey('total')}>
                            Twubric Score {sortKey === 'total' && sortOrder === 'asc' && <ExpandLessIcon />}
                            {sortKey === 'total' && sortOrder === 'desc' && <ExpandMoreIcon />}
                        </Button>
                        <Button onClick={() => sortByKey('friends')}>
                            Friends {sortKey === 'friends' && sortOrder === 'asc' && <ExpandLessIcon />}
                            {sortKey === 'friends' && sortOrder === 'desc' && <ExpandMoreIcon />}
                        </Button>
                        <Button onClick={() => sortByKey('influence')}>
                            Influence {sortKey === 'influence' && sortOrder === 'asc' && <ExpandLessIcon />}
                            {sortKey === 'influence' && sortOrder === 'desc' && <ExpandMoreIcon />}
                        </Button>
                        <Button onClick={() => sortByKey('chirpiness')}>
                            Chirpiness {sortKey === 'chirpiness' && sortOrder === 'asc' && <ExpandLessIcon />}
                            {sortKey === 'chirpiness' && sortOrder === 'desc' && <ExpandMoreIcon />}
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button onClick={resetData}>Reset Data</Button>
                    <Button onClick={handleClick}>Date Filter</Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2}>
                            <TextField
                                type="date"
                                label="Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ marginBottom: '10px' }}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    </Popover>
                </Box>
            </Grid>
            {filteredTwubricData.length > 0 ?
                filteredTwubricData.map((personData, index) => (
                    <Grid item xs={12} sm={4} md={4} key={index}>
                        <Box className={classes.mainContainer}>
                            <Box className={classes.nameBox}>
                                <Typography>{personData.username}</Typography>
                                <Typography>{personData.twubric.total}</Typography>
                            </Box>
                            <Grid className={classes.secondContainer}>
                                <Grid item xs={12} sm={4} md={4}>
                                    <Typography>{personData.twubric.friends}</Typography>
                                    <Typography>Friends</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} className={classes.secondChildContainer}>
                                    <Typography>{personData.twubric.influence}</Typography>
                                    <Typography>Influence</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <Typography>{personData.twubric.chirpiness}</Typography>
                                    <Typography>Chirpiness</Typography>
                                </Grid>
                            </Grid>
                            <Grid className={classes.thirdContainer}>
                                <Grid item xs={12} sm={4} md={4} className={classes.thirdChildContainer}>
                                    <Typography>{formatDate(personData.join_date)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8}>
                                    <Typography style={{ textAlign: 'end' }} onClick={() => deleteTwubricData(personData.uid)}>Remove</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                )) :
                <Grid item xs={12}>
                    <Typography style={{ textAlign: 'center', color: 'red', fontSize: '24px' }}>No Data Found</Typography>
                </Grid>
            }
        </Grid>
    )
}

export default Twubric;
