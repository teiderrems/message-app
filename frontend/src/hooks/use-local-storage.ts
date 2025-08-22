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

    const clearValue = (key: string) => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    };

    const clearAll = () => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    };

    return { getValue, setValue, clearValue, clearAll };
}

export default useLocalStorage;
