export interface InputProps{
    name:string;
    type?:string;
    placeholder?:string;
    value:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
    icon?:React.ReactNode,
    label?:string,
    required?:boolean,
    disabled?:boolean
}