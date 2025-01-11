import { StyledButton } from "./styles";
import { ButtonProps } from "../types";

export const Button = ({ color, bgcolor, children, onClick }: ButtonProps) => (
  <StyledButton color={color} bgcolor={bgcolor} onClick={onClick}>
    {children}
  </StyledButton>
);
