import React, { Component } from "react";

import "./ResourceHero.css";

class ResourceHero extends Component {
  render() {
    return (
      <div classname="resource-hero">
        <div classname="hero-text">
          <h1>
            Find resources <span class="blue">for IMSA classes</span>
          </h1>
          <h2 style={{ fontWeight: 400 }}>
            Sort by teacher, subject, and more!
          </h2>
        </div>
      </div>
    );
  }
}

export default ResourceHero;
