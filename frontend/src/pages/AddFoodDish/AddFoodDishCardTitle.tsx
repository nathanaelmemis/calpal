import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { UserDataInterface } from "../../Interface"

interface AddFoodDishCardTitleProps {
    mealType: string
    mealCalories: number
    mealCaloriesIncrease: number
    userData: UserDataInterface
}

function AddFoodDishCardTitle({ mealType, mealCalories, mealCaloriesIncrease, userData }: AddFoodDishCardTitleProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    // Round off to nearest hundredth
    function formatNumber(num: number) {
        return Math.ceil(num * 100) / 100
    }

    return (
        <Grid 
            xs={12}
            item
            mb={'1em'}
        >
            <Typography 
                variant={"h6"}
                fontWeight={'bold'}
            >
                Add a {mealType?.toLocaleLowerCase()}
            </Typography>
            <Typography
                variant={isMobile ? 'body2' : 'body1'}
            >{`${formatNumber(mealCalories + mealCaloriesIncrease)} / ${userData[mealType.toLowerCase() + 'CaloriesLimit']} g`}</Typography>
        </Grid>
    )
}

export default AddFoodDishCardTitle