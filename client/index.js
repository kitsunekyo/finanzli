const uploadForm = document.getElementById("uploadForm"); // not really necessary but I prefer getting/setting it explicitly
const spinnerEl = document.getElementById("spinner");
const imageEl = document.getElementById("image"); // not really necessary but I prefer getting/setting it explicitly
/**
 * request presigned post url
 */
uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    uploadForm.querySelector("input[type=submit]").setAttribute("disabled", true);
    spinnerEl.style.setProperty("display", "block");

    const file = event.target.elements.file.files[0];
    if (!file) {
        console.log("no file specified");
        return;
    }

    const presignedPost = await requestPresignedPost(file);
    const uploadedFileUrl = await uploadFile(file, presignedPost);

    spinnerEl.setAttribute("display", "none");
    imageEl.setAttribute("src", uploadedFileUrl);
    spinnerEl.style.removeProperty("display");
    uploadForm.querySelector("input[type=submit]").removeAttribute("disabled");
});

/**
 * @param {string} fileName
 * @returns {Promise} presignedPostData
 */
async function requestPresignedPost(file) {
    const { name, size, type } = file;
    const res = await window.fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            type,
            size,
        }),
    });
    return res.json();
}

/**
 * upload file with presigned post url
 * @param {file} file
 * @param {object} presignedPost
 * @returns {Promise<string>} decoded URI to uploaded file
 */
async function uploadFile(file, presignedPost) {
    const formData = new FormData();
    formData.append("Content-Type", file.type);
    Object.entries(presignedPost.fields).forEach(([key, value]) => {
        formData.append(key, value);
    });
    formData.append("file", file);

    const res = await window.fetch(presignedPost.url, {
        method: "POST",
        body: formData,
    });

    const location = res.headers.get("Location");
    return decodeURIComponent(location);
}
