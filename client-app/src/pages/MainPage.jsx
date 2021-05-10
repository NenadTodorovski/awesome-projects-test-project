import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import { Row, Col } from "react-bootstrap";

import AddProjectForm from "../components/AddProjectForm";
import ProjectsList from "../components/ProjectsList";

export const MainContextContainer = React.createContext(null);

const PROJECTS_QUERY = gql`
  {
    projects {
      projectId
      name
      description
    }
  }
`;

const MainPage = () => {
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY);

  useEffect(() => {
    if (triggerRefetch) {
      refetch();
      setTriggerRefetch(false);
    }
  }, [triggerRefetch, updateData, refetch]);

  return (
    <Row className="m-0">
      <MainContextContainer.Provider value={{ updateData, setUpdateData }}>
        <Col>
          <AddProjectForm setTriggerRefetch={setTriggerRefetch} />
        </Col>
        <Col>
          <ProjectsList
            loading={loading}
            error={error}
            data={data}
            setTriggerRefetch={setTriggerRefetch}
          />
        </Col>
      </MainContextContainer.Provider>
    </Row>
  );
};

export default MainPage;
