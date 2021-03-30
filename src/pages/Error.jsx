import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Errors from "../images/error.gif";

function Error() {
  return (
    <Wrapper>
      <Link to="/">
        <img src={Errors} alt="Error" />
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  /* min-height: 90vh; */
  display: grid;
  place-items: center;
  background: var(--clr-primary-10);
  text-align: center;
  height: 95vh;
  img {
    height: 100vh;
    width: 100vw;
  }
`;

export default Error;
