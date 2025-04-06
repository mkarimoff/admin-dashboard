import styled from "styled-components";

interface ContainerProps {
  $primary?: boolean;
}
export const Container = styled.div<ContainerProps>`
  padding: ${(props) => (props.$primary ? "#BF4F74" : "30px 40px")};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MiniCon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Wrapper = styled.div`
  display: flex;
  margin-left: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 2px 10px;
`;