import { Row, Col } from "antd";
import { Slide } from "react-awesome-reveal";
import { Button } from "../../common/Button";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";
import { useNavigate } from 'react-router-dom';

interface MiddleBlockProps {
  title: string;
  content: string;
  button: string;
  url: string;
}

const MiddleBlock = ({ title, content, button, url, t }: MiddleBlockProps) => {
  
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id) as HTMLDivElement;
    element.scrollIntoView({
      behavior: "smooth",
    });
  };
  
  const goToPage = (page: string) => {
    navigate(page);
  };



  return (
    <MiddleBlockSection>
      <Slide direction="up" triggerOnce>
        <Row justify="center" align="middle">
          <ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h2>{(title)}</h2>
              <Content>{(content)}</Content>
              {button && (
                <Button name="submit" onClick={() => goToPage(url)}>
                  {(button)}
                </Button>
              )}
            </Col>
          </ContentWrapper>
        </Row>
      </Slide>
    </MiddleBlockSection>
  );
};

export default (MiddleBlock);
