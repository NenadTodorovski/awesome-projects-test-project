import React from "react";

import ProjectItem from "./ProjectItem";
import { Container, Spinner } from "react-bootstrap";

const ProjectsList = ({ loading, error, data, ...props }) => {
  if (loading)
    return (
      <Spinner
        as="span"
        animation="border"
        role="status"
        style={{
          height: "100px",
          width: "100px",
          position: "absolute",
          top: "45%",
          left: "45%",
        }}
      />
    );
  if (error) return `Error! ${error.message}`;

  return (
    <Container className="p-3">
      <h4>List of projects</h4>
      <br />
      {data.projects &&
        data.projects.map((project) => {
          return (
            <ProjectItem
              key={project.projectId}
              project={project}
              setTriggerRefetch={props.setTriggerRefetch}
            />
          );
        })}
    </Container>
  );
};

export default ProjectsList;
