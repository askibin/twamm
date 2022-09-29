import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

export const CardList = styled(List)`
  display: flex;
  flex-wrap: wrap;
`;

export const BlankCardList = styled(List)`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 8px 16px;
  }
`;

export const CardListItem = styled(ListItem)`
  width: auto;
`;
