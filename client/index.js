const uploadForm = document.getElementById("uploadForm");

/**
 * request presigned post url
 */
uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const file = event.target.elements.file.files[0];
    if (!file) {
        console.log("no file specified");
        return;
    }

    const presignedPost = await requestPresignedPost(file);
    const response = await uploadFile(file, presignedPost);

    console.log(response);
});

/**
 * @param {string} fileName
 * @returns {Promise} presignedPostData
 */
async function requestPresignedPost(file) {
    const { name, size, type } = file;
    const res = await window.fetch("http://localhost:3000/s3", {
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
 * @returns {Promise} s3 upload response
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

    return res.json();
}
