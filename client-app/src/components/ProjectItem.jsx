import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import { Card, Button, Col, Row } from "react-bootstrap";

import { MainContextContainer } from "../pages/MainPage";

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      projectId
      name
      description
    }
  }
`;

const ProjectItem = ({
  project: { projectId, name, description },
  ...props
}) => {
  const history = useHistory();
  const { setUpdateData } = useContext(MainContextContainer);

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    variables: { id: projectId },
  });

  const onDeleteProjectHandler = () => {
    deleteProject().then(() => {
      props.setTriggerRefetch(true);
    });
  };

  const btnStyle = { flex: "0 0", alignSelf: "flex-end", margin: "auto 5px" };

  return (
    <Card bg="light" border="dark" className="mb-1">
      <Card.Body>
        <Col>
          <Row
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Card.Title style={{ flex: "1 1", alignSelf: "flex-start" }}>
              {name}
            </Card.Title>

            <Button
              variant="success"
              style={btnStyle}
              size="sm"
              onClick={() => history.push(`/project/${projectId}`)}
            >
              Details
            </Button>
            <Button
              variant="info"
              style={btnStyle}
              size="sm"
              onClick={() => setUpdateData({ projectId, name, description })}
            >
              Update
            </Button>
            <Button
              variant="danger"
              style={btnStyle}
              size="sm"
              onClick={() => onDeleteProjectHandler()}
            >
              Delete
            </Button>
          </Row>
          <hr />
          <Card.Text>{description}</Card.Text>
        </Col>
      </Card.Body>
    </Card>
  );
};

export default ProjectItem;
