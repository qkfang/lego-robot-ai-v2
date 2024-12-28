import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import Toolbar from '../../components/Toolbar';
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";


const Header = () => {
  const [visible, setVisibility] = useState(false);

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    return (
      <>
        <CustomNavLinkSmall
          style={{ width: "100px" }}>
          <Span>
            <Button bgcolor="#2e186a" onClick={() => window.location.href = '/Chat' }>{("ChatBot")}</Button>
          </Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "100px" }}>
          <Span>
            <Button bgcolor="#fff" color="#000"  onClick={() => window.location.href = '/brick' }>{("Brick")}</Button>
          </Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "100px" }}>
          <Span>
            <Button bgcolor="#fff" color="#000" onClick={() => window.location.href = '/image' }>{("Image")}</Button>
          </Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "100px" }}>
          <Span>
            <Button bgcolor="#fff" color="#000" onClick={() => window.location.href = '/voice' }>{("Voice")}</Button>
          </Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "100px" }}>
          <Span>
            <Button bgcolor="#fff" color="#000" onClick={() => window.location.href = '/about' }>{("About")}</Button>
          </Span>
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <SvgIcon src="logo.png" height="100px" />
            <Toolbar />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={toggleButton}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={toggleButton}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={toggleButton}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default (Header);
