import React, { useState, MouseEvent } from "react";
import { EntComp } from "./Entity";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Device } from "waziup";

type Props = {
    device: Device;
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    name: {
        cursor: "text",
        '&:hover': {
            "text-decoration": "underline",
        },
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export const DeviceComp = ({ device }: Props) => {
    const classes = useStyles();

    const [deviceName, setDeviceName] = useState(device.name);
    const handleNameClick = () => {
        const newDeviceName = prompt("New device name:", deviceName);
        if (newDeviceName) setDeviceName(newDeviceName);
        handleClose();
    }

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const handleDeviceClick = (event: MouseEvent) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>R</Avatar>
                }
                action={
                    <IconButton aria-label="settings" aria-controls="device-menu" aria-haspopup="true" onClick={handleDeviceClick}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <span onClick={handleNameClick} className={classes.name}>{deviceName}</span>
                }
                subheader={`ID ${device.id}`}
            />
            <Menu
                id="device-menu"
                anchorEl={menuAnchorEl}
                keepMounted
                open={Boolean(menuAnchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleNameClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    This impressive paella is a perfect party dish and a fun meal to cook together with your
                    guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
            </CardContent>
        </Card>
    );
}

// export class DeviceComp extends React.Component<Props, State> {

//     constructor(props: Props) {
//         super(props);
//         this.state = this.props;
//         this.handleNameClick = this.handleNameClick.bind(this);
//     }

//     handleNameClick() {
//         var device = this.state.device;
//         var newName = prompt("Enter new device name:", device.name);
//         if (newName && newName != device.name) {
//             this.setState(() => {
//                 device.name = newName;
//                 return this.state;
//             });
//         }
//     }

//     render() {
//         var device = this.state.device;
//         return (
//             <Card>
//                 <CardHeader
//                     avatar={
//                         <Avatar aria-label="recipe">
//                             R
//                     </Avatar>
//                     }
//                     action={
//                         <IconButton aria-label="settings">
//                             <MoreVertIcon />
//                         </IconButton>
//                     }
//                     title={device.name}
//                     subheader={`ID ${device.id}`}
//                 />
//                 <CardContent>
//                     <Typography variant="body2" color="textSecondary" component="p">
//                         This impressive paella is a perfect party dish and a fun meal to cook together with your
//                         guests. Add 1 cup of frozen peas along with the mussels, if you like.
//                 </Typography>
//                 </CardContent>
//             </Card>
//             // <div className="devices-device">
//             //     <div className="device-name" onClick={this.handleNameClick}>{device.name}</div>
//             //     {device.sensors.map(sensor => <EntComp key={sensor.id} type="sensor" ent={sensor} />)}
//             // </div>
//         );
//     }
// }