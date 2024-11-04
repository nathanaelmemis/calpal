import { Box, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

interface LabeledGaugeProps {
    value: number;
    innerText: string;
    bottomText: string;
    color: string;
}

function LabeledGauge({ value, innerText, bottomText, color }: LabeledGaugeProps) {
    function validateValue(value: number) {
        if (isNaN(value)) {
            return 0
        } else if (value > 1) {
            return 100
        } else {
            return value * 100
        }
    }

    return (
        <Box 
            width={'100%'}
            height={'100%'}
            display={'flex'}
            flexDirection={'column'}>
            <Gauge 
                value={validateValue(value)}
                text={innerText}
                cornerRadius={50}
                startAngle={-140}
                endAngle={140}
                sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: {
                            xs: theme.typography.body2.fontSize,
                            sm: theme.typography.h6.fontSize
                        },
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 'bold',
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: color,
                    },
                })}
            />
            <Typography
                textAlign={'center'}
                sx={(theme) =>({
                    fontSize: {
                        xs: theme.typography.body2.fontSize,
                        sm: theme.typography.body1.fontSize
                    }
                })}
            >
                {bottomText}
            </Typography>
        </Box>
    )
}

export default LabeledGauge;