import type { RootState } from "../app/store/store";
import { useSelector, type TypedUseSelectorHook } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
