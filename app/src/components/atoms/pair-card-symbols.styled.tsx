import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { styled } from "@mui/material/styles";

const div = styled("div");

const styledAvatar = styled(Avatar);
const styledAvatarGroup = styled(AvatarGroup);

export const Root = div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const TokenAvatar = styledAvatar`
  width: 24px;
  height: 24px;
`;

export const TokenAvatarGroup = styledAvatarGroup`
  padding-right: 8px;
`;
