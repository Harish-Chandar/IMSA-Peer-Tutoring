const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

export function handleForm(formData) {
    const teacher = formData.get("teacher");
    const email = formData.get("email");
    const course = formData.get("course");
    const department = formData.get("department");
    const url = formData.get("url");
    const type = formData.get("type"); // Optional field if applicable
    console.log(`Teacher: ${teacher}, Email: ${email}, Course: ${course}, Department: ${department}, URL: ${url}, Type: ${type}`);
    const resourceData = {
      teacher,
      email,
      course,
      department,
      url,
      type: type || "" // Default to an empty string if type is not provided
  };fetch("http://" + HOST + ":" + DBPORT + "/api/resources", { // change hardcoding
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(resourceData)
})
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Resource added successfully:", data);
        alert("Resource added successfully!");
    })
    .catch((error) => {
        console.error("Error adding resource:", error);
        alert("Failed to add resource. Please try again.");
    });
}