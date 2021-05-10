import React, { useState, useEffect, useContext } from "react";
import { gql, useMutation } from "@apollo/client";

import { Form, Button, Container, Spinner } from "react-bootstrap";

import { MainContextContainer } from "../pages/MainPage";

const ADD_PROJECT_MUTATION = gql`
  mutation AddProject($name: String!, $description: String!) {
    addProject(name: $name, description: $description) {
      projectId
      name
      description
    }
  }
`;
const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: String!, $name: String!, $description: String!) {
    updateProject(id: $id, name: $name, description: $description) {
      projectId
      name
      description
    }
  }
`;
const AddProjectForm = ({ setTriggerRefetch }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const { updateData, setUpdateData } = useContext(MainContextContainer);

  useEffect(() => {
    if (!projectName && !projectDescription) {
      setUpdateData(null);
    }
  }, [projectName, projectDescription, setUpdateData]);

  useEffect(() => {
    if (updateData) {
      setProjectName(updateData.name);
      setProjectDescription(updateData.description);
    }
  }, [updateData]);

  const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
    variables: { name: projectName, description: projectDescription },
  });
  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
    variables: {
      id: updateData ? updateData.projectId : null,
      name: projectName,
      description: projectDescription,
    },
  });

  const onAddorUpdateProjectHandler = () => {
    if (projectName && projectDescription) {
      if (updateData) {
        updateProject().then(() => {
          setProjectName("");
          setProjectDescription("");
          setUpdateData(null);
          setTriggerRefetch(true);
        });
      } else {
        addProject().then(() => {
          setProjectName("");
          setProjectDescription("");
          setTriggerRefetch(true);
        });
      }
    }
  };

  return (
    <Container className="p-3">
      <Form onSubmit={(e) => e.preventDefault()}>
        <h4>{!updateData ? "Add Project" : "Update Project"}</h4>

        <Form.Group>
          <Form.Label>Project name: </Form.Label>
          <Form.Control
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            type="text"
            placeholder="Please provoide a name for the project"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description: </Form.Label>
          <Form.Control
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Please provide a description for the project"
            as="textarea"
            rows={5}
          />
        </Form.Group>

        <Form.Group>
          {updateData ? (
            <Spinner
              animation="grow"
              size="sm"
              role="status"
              style={{ margin: "auto" }}
              variant="primary"
            />
          ) : null}{" "}
          <Button
            disabled={!projectName || !projectDescription}
            variant="primary"
            size="sm"
            type="button"
            onClick={() => onAddorUpdateProjectHandler()}
          >
            {/* {updateData ? (
              <Spinner
                animation="grow"
                size="sm"
                role="status"
                style={{ margin: "auto" }}
              />
            ) : null} */}
            {updateData ? " Update Project" : "Add Project"}
          </Button>{" "}
          <Button
            disabled={!projectName && !projectDescription}
            variant="danger"
            size="sm"
            type="button"
            onClick={() => {
              setUpdateData(null);
              setProjectName("");
              setProjectDescription("");
            }}
          >
            Reset Form
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default AddProjectForm;
