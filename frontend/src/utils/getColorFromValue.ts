import { Theme } from "@mui/material/styles"

export function getColorFromValue(value: number, valueLimit: number, theme: Theme) {
    if (valueLimit - value < -5) {
        return theme.palette.error.main
    } else if (valueLimit - value < -2) {
        return theme.palette.warning.main
    } else if (Math.abs(valueLimit - value) < 2) {
        return theme.palette.success.main
    } else {
        return theme.palette.secondary.main
    }
}