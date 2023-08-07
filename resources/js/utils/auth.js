function getLocalStorageItem(key) {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return undefined;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error("Error getting item from local storage:", error);
        return undefined;
    }
}

function setLocalStorageItem(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error("Error setting item in local storage:", error);
        return false;
    }
}

export { getLocalStorageItem, setLocalStorageItem };
