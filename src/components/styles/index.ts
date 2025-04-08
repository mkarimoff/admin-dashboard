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

export const ProductModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .inputs-con {
    display: flex;
    gap: 10px;
    .inputs-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      input,
      select {
        width: 350px;
        height: 48px;
        border: none;
        padding: 10px;
      }
    }
  }
`;

export const ProDetailCon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`