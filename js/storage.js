/**
 * Constant representing the token used for remote storage access
 * @type {string}
 */
const STORAGE_TOKEN = 'IQKYVZL2QYYEN4MX682TYIV0ABWM6ZAI516B1PB1';

/**
 * Constant representing the URL of the remote storage endpoint
 * @type {string}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Async function to set an item in the remote storage
 * @param {string} key - The key of the item to set
 * @param {any} value - The value of the item to set
 * @returns {Promise<any>} - A promise that resolves to the response from the remote storage
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Async function to retrieve an item from remote storage
 * @param {string} key - The key of the item to retrieve
 * @returns {Promise<any>} - A promise that resolves to the value of the retrieved item
 * @throws Will throw an error if the data with the specified key is not found
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (res.data) { 
                return res.data.value;
            } 
            throw `Could not find data with key "${key}".`;
        });
}