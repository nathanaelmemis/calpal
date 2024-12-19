import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useContext } from "react"
import { UserDataContext } from "../../context/UserDataContext"
import { formatNumber } from "../../utils/formatNumber"
import { getColorFromValue } from "../../utils/getColorFromValue"

interface AddFoodDishCardTitleProps {
    mealCalories: number
    mealCaloriesIncrease: number
}

function AddFoodDishCardTitle({ mealCalories, mealCaloriesIncrease }: AddFoodDishCardTitleProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        userData,
        mealType
    } = useContext(UserDataContext)

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
                Add a {mealType}
            </Typography>
            <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color={getColorFromValue(formatNumber(mealCalories + mealCaloriesIncrease), userData[mealType + 'CaloriesLimit'] as number, useTheme())}
            >
                {`${formatNumber(mealCalories + mealCaloriesIncrease)} / ${userData[mealType + 'CaloriesLimit']} g`}
            </Typography>
        </Grid>
    )
}

export default AddFoodDishCardTitle