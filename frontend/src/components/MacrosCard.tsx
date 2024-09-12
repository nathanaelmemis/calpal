import { Grid, useMediaQuery, useTheme } from "@mui/material";
import LabeledGauge from "./LabeledGauge";

import { TotalMacrosInterface, UserDataInterface } from "../Interface";
import { LabeledBorderLinearProgress } from "./LabeledBorderLinearProgress";

interface MacrosCardInterface {
    userData: UserDataInterface,
    totalMacros: TotalMacrosInterface
}

export function MacrosCard({ userData, totalMacros }: MacrosCardInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    // Round off to nearest hundredth
    function formatNumber(num: number) {
        return Math.ceil(num * 100) / 100
    }

    return (
        <Grid 
            bgcolor={'primary.main'}
            mb={isMobile ? '1.25em' : '2em'}
            display={'flex'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            container
            sx={{
                boxShadow: 5,
                borderRadius: 5,
                p: {
                    sm: '1em 0',
                    xs: '.5em'
                }
            }}>
            <Grid
                item
                sm={4}
                xs={12}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '200px',
                        xs: '180px'
                    },
                    height: {
                        sm: '200px',
                        xs: '150px'
                    },
                    mb: {
                        sm: '0',
                        xs: '1em'
                    }
                }}
            >
                <LabeledGauge 
                    value={totalMacros.calories/userData.caloriesLimit}
                    innerText="Calories"
                    bottomText={`${formatNumber(totalMacros.calories)} / ${userData.caloriesLimit} kcal`}/>
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
                display={'flex'}
                justifyContent={'center'}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Carbs"
                        value={totalMacros.carbs/userData.carbsLimit}
                        bottomText={`${formatNumber(totalMacros.carbs)} / ${userData.carbsLimit} g`}
                    /> :
                    <LabeledGauge 
                        value={totalMacros.carbs/userData.carbsLimit}
                        innerText="Carbs"
                        bottomText={`${formatNumber(totalMacros.carbs)} / ${userData.carbsLimit} g`}
                    />
                }
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Protein"
                        value={totalMacros.protein/userData.proteinLimit}
                        bottomText={`${formatNumber(totalMacros.protein)} / ${userData.proteinLimit} g`}
                    /> :
                    <LabeledGauge 
                        value={totalMacros.protein/userData.proteinLimit}
                        innerText="Protein"
                        bottomText={`${formatNumber(totalMacros.protein)} / ${userData.proteinLimit} g`}
                    />
                }
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Fats"
                        value={totalMacros.fats/userData.fatsLimit}
                        bottomText={`${formatNumber(totalMacros.fats)} / ${userData.fatsLimit} g`}
                    /> :
                    <LabeledGauge 
                        value={totalMacros.fats/userData.fatsLimit}
                        innerText="Fats"
                        bottomText={`${formatNumber(totalMacros.fats)} / ${userData.fatsLimit} g`}
                    />
                }
            </Grid>
        </Grid>
    )
}