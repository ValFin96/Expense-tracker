import React from 'react';
import Typography from '@mui/material/Typography';


type HeaderProps = {
    text: string;
};

const Header: React.FC<HeaderProps> = ({ text }) => {
    return (
        <Typography variant="h4" component="h4" style={{ marginBottom: '1em'}}>
            {text}
        </Typography>
    );
};

export default Header;