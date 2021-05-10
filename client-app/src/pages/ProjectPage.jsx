import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { Row, Spinner, Col } from "react-bootstrap";

import ProjectDetails from "../components/ProjectDetails";
import AddTimeForm from "../components/AddTimeForm";
import TimesList from "../components/TimesList";

const PROJECT_QUERY = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      projectId
      name
      description
      timesList {
        timeId
        description
        amount
      }
    }
  }
`;

const ProjectPage = (props) => {
  const { projectId } = props.match.params;

  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const { loading, error, data, refetch } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId },
  });

  useEffect(() => {
    if (triggerRefetch) {
      refetch();
      setTriggerRefetch(false);
    }
  }, [triggerRefetch, refetch]);

  // While loading
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
  // In case of error
  if (error) return `Error! ${error.message}`;
  //If the mock db doesn't find a project - usually when navigating through the browser searchbar
  if (!data.project)
    return (
      <div
        style={{
          position: "absolute",
          top: "40vh",
          left: "30%",
          fontSize: "28pt",
        }}
      >
        <p>
          Something went wrong... Please go <Link to="/">back</Link>!
        </p>
      </div>
    );

  return (
    <>
      <Row className="m-0">
        <Col>{data && <ProjectDetails project={data.project} />}</Col>
        <Col>
          <AddTimeForm
            projectId={projectId}
            setTriggerRefetch={setTriggerRefetch}
          />
        </Col>
      </Row>
      <hr />
      {data && (
        <TimesList
          loading={loading}
          error={error}
          data={data.project.timesList}
          setTriggerRefetch={setTriggerRefetch}
        />
      )}
    </>
  );
};

export default ProjectPage;
