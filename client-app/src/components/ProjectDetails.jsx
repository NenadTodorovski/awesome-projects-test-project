import React from "react";

import { Container, Card } from "react-bootstrap";

const ProjectDetails = ({ project: { projectId, name, description } }) => {
  return (
    <Container className="p-3">
      <h4>PROJECT SUMMARY</h4>
      <Card style={{ minHeight: "300px" }}>
        <Card.Body>
          <Card.Title>
            <span style={{ fontWeight: "400" }}>Name: </span>
            {name}
          </Card.Title>
          <hr />
          <Card.Subtitle className="mb-2 text-muted">
            <h5 style={{ fontWeight: "400" }}>Project Id: </h5>
            {projectId}
          </Card.Subtitle>
          <br />
          <Card.Text>
            <span
              style={{
                fontSize: "14pt",
                fontWeight: "600",
                display: "block",
              }}
            >
              Project description:
            </span>
            {description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectDetails;
