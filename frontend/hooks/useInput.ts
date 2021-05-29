import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(init: T): ReturnTypes<T> =>{
    const [value, setValue] =useState(init);
    const handler = useCallback((e: ChangeEvent<HTMLInputElement>)=>{
        setValue((e.target.value as unknown) as T);
    },[]);
    return [value, handler, setValue];
};

export default useInput;