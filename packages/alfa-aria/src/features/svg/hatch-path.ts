import * as Roles from "../../roles";
import { Feature, None } from "../../types";

/**
 * @see https://www.w3.org/TR/svg-aam/#mapping_role_table
 */
export const HatchPath: Feature = {
  element: "hatchPath",
  allowedRoles: () => None(Roles)
};