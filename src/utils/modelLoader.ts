export function loadModelWithTimeout(url: string, timeout: number): Promise<GLTF> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error(`Loading timed out after ${timeout} ms`));
        }, timeout);

        fetch(url, { signal })
            .then(response => {
                if (!response.ok) {
                    reject(new Error(`Failed to load model: ${response.statusText}`));
                }
                return response;
            })
            .then(response => response.arrayBuffer())
            .then(buffer => {
                // Assuming you have a method to parse the GLTF from the buffer
                const gltf = parseGLTF(buffer);
                clearTimeout(timeoutId);
                resolve(gltf);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}