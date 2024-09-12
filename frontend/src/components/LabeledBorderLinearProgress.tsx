import { Box, LinearProgress, linearProgressClasses, styled, Typography } from "@mui/material";

interface LabeledBorderLinearProgressProps {
    label: string
    value: number
    bottomText: string
}

export function LabeledBorderLinearProgress({ label, value, bottomText }: LabeledBorderLinearProgressProps) {
    return (
        <Box 
            width={'100%'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Typography 
                variant='body2'
                fontWeight={'bold'}
                mb={'0.5em'}
            >
                {label}
            </Typography>
            <BorderLinearProgress
                variant="determinate"
                value={value  * 100}
            />
            <Typography
                textAlign={'center'}
                variant={'body2'}
                mt={'0.5em'}
            >
                {bottomText}
            </Typography>
        </Box>
    )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    width: '80%',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.secondary.main,
    },
}));
