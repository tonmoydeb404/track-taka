import React from "react";
import icons from "../../data/icons";

export const GetIcon = ({ name, ...props }) => {
  const Icon = icons[name];
  if (!Icon) return null;

  return <Icon {...props} />;
};

export default GetIcon;
