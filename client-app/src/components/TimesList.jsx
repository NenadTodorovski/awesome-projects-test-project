import React from "react";
import { gql, useMutation } from "@apollo/client";

import { Container, Spinner, Table, Button } from "react-bootstrap";

const DELETE_TIME = gql`
  mutation DeleteTime($id: String!) {
    deleteTime(id: $id) {
      timeId
    }
  }
`;

const Times = ({ loading, error, data, setTriggerRefetch }) => {
  const [deleteTime] = useMutation(DELETE_TIME);

  const onDeleteTimeHandler = (timeID) => {
    deleteTime({ variables: { id: timeID } }).then(() => {
      setTriggerRefetch(true);
    });
  };

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
      <h4>List of times</h4>
      <br />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((time) => {
              return (
                <tr key={time.timeId}>
                  <td>{time.description}</td>
                  <td>{time.amount}</td>
                  <td>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => onDeleteTimeHandler(time.timeId)}
                    >
                      DELETE
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Times;
