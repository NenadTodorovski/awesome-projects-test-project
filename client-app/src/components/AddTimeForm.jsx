import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { Container, Form, Button } from "react-bootstrap";

const ADD_TIME_MUTATION = gql`
  mutation AddTime(
    $projectRefId: String!
    $description: String!
    $amount: Int!
  ) {
    addTime(
      projectRefId: $projectRefId
      description: $description
      amount: $amount
    ) {
      timeId
      projectRefId
      description
      amount
    }
  }
`;

const AddTimeForm = ({ projectId, setTriggerRefetch }) => {
  const [timeDescription, setTimeDescription] = useState("");
  const [timeAmount, setTimeAmount] = useState(0);

  const [addTime] = useMutation(ADD_TIME_MUTATION, {
    variables: {
      projectRefId: projectId,
      description: timeDescription,
      amount: timeAmount,
    },
  });

  const onAddTimeHandler = () => {
    addTime().then(() => {
      setTimeDescription("");
      setTimeAmount(0);
      setTriggerRefetch(true);
    });
  };

  return (
    <Container className="p-3">
      <h4>Add New Time</h4>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group>
          <Form.Label>Time/Task description: </Form.Label>
          <Form.Control
            value={timeDescription}
            onChange={(e) => setTimeDescription(e.target.value)}
            type="text"
            placeholder="Please provide description for the time slot"
            as={"textarea"}
            rows={5}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Amount: </Form.Label>
          <Form.Control
            value={timeAmount}
            onChange={(e) => setTimeAmount(parseInt(e.target.value))}
            type="number"
          />
        </Form.Group>

        <Button
          disabled={!timeAmount || !timeDescription}
          variant="primary"
          type="button"
          onClick={() => onAddTimeHandler()}
        >
          Add Project
        </Button>
      </Form>
    </Container>
  );
};
export default AddTimeForm;
