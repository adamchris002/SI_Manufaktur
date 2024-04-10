import React from "react";
import { Typography } from "@mui/material";

const UnauthorizedPage = () => {
  return (
    <div>
      <Typography variant="h4">Unauthorized Access</Typography>
      <Typography variant="body1">You do not have permission to access this page.</Typography>
      {/* You can add additional content or links here */}
    </div>
  );
};

export default UnauthorizedPage;
