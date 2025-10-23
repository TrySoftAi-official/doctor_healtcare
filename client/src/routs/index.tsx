import { LayoutDashboard } from "lucide-react";
import { SCREEN_PATH } from "../constants";
import { getLink } from "../utils/genral";

export const USER_ROUTES = [
  {
    pathname: SCREEN_PATH.DASHBOARD.pathname,
    label: getLink({
      path: SCREEN_PATH.DASHBOARD.pathname,
      label: "Dashboard",
    }),
    key: SCREEN_PATH.DASHBOARD.key,
    icon: <LayoutDashboard size={20} />,
  },
  {
    pathname: SCREEN_PATH.SEARCH.pathname,
    label: getLink({
      path: SCREEN_PATH.SEARCH.pathname,
      label: "User",
    }),
    key: SCREEN_PATH.SEARCH.key,
    icon: <LayoutDashboard size={20} />,
  },
  {
    pathname: SCREEN_PATH.PROFILE.pathname,
    label: getLink({
      path: SCREEN_PATH.PROFILE.pathname,
      label: "Setting",
    }),
    key: SCREEN_PATH.PROFILE.key,
    icon: <LayoutDashboard size={20} />,
  },
];
