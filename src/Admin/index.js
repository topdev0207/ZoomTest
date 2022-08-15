import React, { useState } from "react";
import { ButtonContainer, Form, DashboardContainer, StyledButton } from "./AdminStyle";
import axios from "axios";

function Admin() {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
      // TODO: check that all fields are not empty
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(inputs);

      // get meeting data from form
      const meetingData = {
        //password: inputs.password,
        topic: "Virtual lesson with student " + inputs.student + " and tutor " + inputs.tutor,
        start_time: inputs.dateTime,
      }

      try {
        await axios.post('http://localhost:3008/meeting', meetingData)
            .then((response) => {
              console.log("API call successful. Response data: " + response)
              // redirect user to "successful meeting creation"
            }, (error) => {
                console.log("Error occurred: " + error);
            });
      } catch (error) {
          console.log("API call failed" + error);
      }
    }

  return (
    <>
      <DashboardContainer>
        <h2>Hello admin</h2>
        <h3>Create a new meeting</h3>
        <Form onSubmit={handleSubmit} >
            <label>Student</label>
            {/* TODO: replace following code to fetch data from database*/}
            <select
                name="student"
                value={inputs.student || ""}
                onChange={handleChange}
                required
            >
                <option selected hidden>Choose...</option>
                <option value="student 1">Student 1</option>
                <option value="student 2">Student 2</option>
            </select>
            <label htmlFor='for'>Tutor</label>
            {/* TODO: replace following code to fetch data from database*/}
            <select
                name="tutor"
                value={inputs.tutor || ""}
                onChange={handleChange}
                required
            >
                <option selected hidden>Choose...</option>
                <option value="tutor 1">Tutor 1</option>
                <option value="tutor 2">Tutor 2</option>
            </select>
            {/* <label>Meeting password</label>
            <input
                type='text'
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                required
            /> */}
            <label>Date and time</label>
            <input
                type="datetime-local"
                name="dateTime"
                value={inputs.dateTime || ""}
                onChange={handleChange}
            />
            <ButtonContainer>
                <StyledButton type='submit'>CONFIRM</StyledButton>
            </ButtonContainer>
        </Form>
      </DashboardContainer>
    </>
  );
}

export default Admin;
