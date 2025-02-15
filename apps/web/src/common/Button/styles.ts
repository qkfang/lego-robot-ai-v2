import styled from "styled-components";

export const StyledButton = styled("button")<{ color?: string, bgcolor?: string }>`
  background: ${(p) => p.bgcolor || "#2e186a"};
  color: ${(p) => (p.color ? "#2E186A" : "#fff")};
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  border: 1px solid #edf3f5;
  border-radius: 4px;
  padding: 10px 0;
  cursor: pointer;
  margin-top: 0.625rem;
  max-width: 150px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 10px 20px rgb(23 31 114 / 20%);

  &:hover,
  &:active,
  &:focus {
    color: #fff;
    border: 1px solid rgb(255, 130, 92);
    background-color: rgb(255, 130, 92);
  }
`;
