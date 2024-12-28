import { StyledTextArea, StyledContainer, Label } from "./styles";
import { InputProps } from "../types";

const TextArea = ({ name, placeholder, onChange, t }: InputProps) => (
  <StyledContainer>
    <Label htmlFor={name}>{t(name)}</Label>
    <StyledTextArea
      placeholder={t(placeholder)}
      id={name}
      name={name}
      onChange={onChange}
    />
  </StyledContainer>
);

export default (TextArea);
