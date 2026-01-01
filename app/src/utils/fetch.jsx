export const fetchData = async ({
                                    url,
                                    method = "GET",
                                    body = null,
                                    onSuccess,
                                    navigate,
                                    onStart,
                                    onFinally,
                                }) => {
    try {
        onStart?.();

        const options = {
            method,
            credentials: "include",
        };

        if (method !== "GET" && body) {
            options.headers = {
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(body);
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (response.status === 204 || response.status === 200 && response.headers.get("Content-Length") === "0") {
            onSuccess?.();
        } else if (response.status === 200 || response.status === 201) {
            await response.json();
            onSuccess?.();
        } else {
            onSuccess?.();
        }
    } catch {
        navigate("/error", {
            state: {
                message: "An unexpected error occurred",
                code: 500,
            },
        });
    } finally {
        onFinally?.();
    }
};
