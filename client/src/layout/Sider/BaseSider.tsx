import { Menu } from "antd";
import React from "react";
import { USER_ROUTES } from "../../routs";
import { MenuItem } from "../../types/custom.type";
import { SCREEN_PATH } from "../../constants";

const BaseSider = () => {
  /* --------------------------------- HELPERS -------------------------------- */
  const routes = USER_ROUTES;

  const menuItems: MenuItem[] = routes.map((route) => {
    return { ...route };
  });
  const getSelectedMenuItemKeys = (pathname: string): string[] => {
    const splitPath = pathname.split("/");

    const selectedPath = "/" + splitPath[1];

    const route = Object.values(SCREEN_PATH).find((route) =>
      route.pathname.includes(selectedPath)
    );

    if (route) {
      return [route.key];
    }
    return [];
  };
  return (
    <div className="mt-28 ">
      <Menu
        mode="inline"
        defaultSelectedKeys={getSelectedMenuItemKeys(window.location.pathname)}
        items={menuItems}
      />
    </div>
  );
};

export default BaseSider;
