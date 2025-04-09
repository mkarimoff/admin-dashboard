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
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  justify-content: end;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  strong{
   font-weight: 700;
  }
  .desc{
    width: 300px;
  }
  .buttons-wrap{
    display: flex;
    justify-content: end;
    gap: 20px;
  }
`;

export const ImageGallery = styled.div`
  margin-bottom: 2rem;
`;

export const MainImagePlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #e0e0e0;
  color: #555;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  margin-bottom: 1rem;
`;

export const ThumbnailRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const ThumbnailPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ccc;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-size: 0.9rem;
`;
