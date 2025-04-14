import { useState } from "react";

function ResourceForm() {
  const [formData, setFormData] = useState({
    teacher: "",
    email: "",
    classes: "",
    url: "",
    type: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          teacher: "",
          email: "",
          classes: "",
          url: "",
          type: "",
        });
        alert("Resource added successfully!");
      } else {
        alert("Error adding resource: " + data.error);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="teacher"
        value={formData.teacher}
        onChange={handleChange}
        placeholder="Teacher name"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="classes"
        value={formData.classes}
        onChange={handleChange}
        placeholder="Classes"
        required
      />
      <input
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="URL"
        required
      />
      <input
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Resource type"
      />
      <button type="submit">Add Resource</button>
    </form>
  );
}

export default ResourceForm;
