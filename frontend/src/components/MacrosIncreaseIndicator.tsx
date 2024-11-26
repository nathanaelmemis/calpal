import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatNumber } from "../utils/formatNumber";

export function MacrosIncreaseIndicator({
    caloriesIncrease,
    proteinIncrease,
    carbsIncrease,
    fatsIncrease
}: {
    caloriesIncrease: number,
    proteinIncrease: number,
    carbsIncrease: number,
    fatsIncrease: number
}) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    return (
        <Grid
            container
            bgcolor={'primary.main'}
            display={'flex'}
            mb={isMobile ? '1.25em' : '2em'}
            justifyContent={'space-evenly'}
            sx={{
                boxShadow: 5,
                borderRadius: 5,
                py: {
                    sm: '1em',
                    xs: '.75em'
                }
            }}
        >
            <Grid
                item
                xs={4}
            >
                {
                    !isMobile ? '' :
                        <Typography
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Calories
                        </Typography>
                }
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                    sx={(theme) => ({
                        fontSize: {
                            sm: theme.typography.body1.fontSize,
                            xs: theme.typography.body2.fontSize
                        }
                    })}
                >+{formatNumber(caloriesIncrease)} kcal</Typography>
            </Grid>
            <Grid
                item
                xs={2.63}
            >
                {
                    !isMobile ? '' :
                        <Typography
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Carbs
                        </Typography>
                }
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                    sx={(theme) => ({
                        fontSize: {
                            sm: theme.typography.body1.fontSize,
                            xs: theme.typography.body2.fontSize
                        }
                    })}
                >+{formatNumber(carbsIncrease)} g</Typography>
            </Grid>
            <Grid
                item
                xs={2.63}
            >
                {
                    !isMobile ? '' :
                        <Typography
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Protein
                        </Typography>
                }
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                    sx={(theme) => ({
                        fontSize: {
                            sm: theme.typography.body1.fontSize,
                            xs: theme.typography.body2.fontSize
                        }
                    })}
                >+{formatNumber(proteinIncrease)} g</Typography>
            </Grid>
            <Grid
                item
                xs={2.63}
            >
                {
                    !isMobile ? '' :
                        <Typography
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Fats
                        </Typography>
                }
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                    sx={(theme) => ({
                        fontSize: {
                            sm: theme.typography.body1.fontSize,
                            xs: theme.typography.body2.fontSize
                        }
                    })}
                >+{formatNumber(fatsIncrease)} g</Typography>
            </Grid>
        </Grid>
    )
}