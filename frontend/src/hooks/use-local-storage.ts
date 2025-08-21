import { useEffect } from "react";

function useLocalStorage() {

    const getValue = (key: string) => {
        if (typeof window === "undefined") return undefined;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : undefined;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return undefined;
        }
    };
    const setValue = (key: string, value: any) => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    };
    useEffect(()=>{
        // This effect runs once to ensure localStorage is available
        if (typeof window === "undefined") {
            console.warn("LocalStorage is not available in this environment.");
        }
    },[])

    return { getValue, setValue };
}

export default useLocalStorage;
