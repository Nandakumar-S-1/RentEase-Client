import type React from "react";

export interface ButtonProps {
    children:React.ReactNode
    onClick?:()=>void
    type?: 'button' |'submit' |'reset'
    disabled?:boolean,
    loading?:boolean,
    variant?: 'primary'|'secondary'|'outline'
    size?:'sm'|'md'|'lg'
    className?:string
    icon?:React.ReactNode
    iconPosition ?:'left'|'right'
}