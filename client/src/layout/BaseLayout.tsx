import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader";

export default function BaseLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
